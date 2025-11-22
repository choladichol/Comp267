/**
 * Script to sync SQL file data to src/data/sqlData.js
 * 
 * Usage: node scripts/sync-sql-data.js
 * 
 * This script reads the SQL files and updates the data file
 * Run this whenever you update your SQL files
 */

const fs = require('fs');
const path = require('path');

// Paths
const SQL_DIR = path.join(__dirname, '..', '..');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'sqlData.js');

// Helper to parse SQL INSERT values
function parseSQLValues(valuesString) {
  const values = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = null;
  
  for (let i = 0; i < valuesString.length; i++) {
    const char = valuesString[i];
    const nextChar = valuesString[i + 1];
    
    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true;
      quoteChar = char;
      continue;
    }
    
    if (inQuotes && char === quoteChar && nextChar !== quoteChar) {
      inQuotes = false;
      quoteChar = null;
      values.push(current);
      current = '';
      if (nextChar === ',') i++;
      continue;
    }
    
    if (inQuotes && char === quoteChar && nextChar === quoteChar) {
      current += char;
      i++;
      continue;
    }
    
    if (!inQuotes && char === ',') {
      const trimmed = current.trim();
      if (trimmed) {
        values.push(parseValue(trimmed));
      }
      current = '';
      continue;
    }
    
    current += char;
  }
  
  const trimmed = current.trim();
  if (trimmed) {
    values.push(parseValue(trimmed));
  }
  
  return values;
}

function parseValue(value) {
  value = value.trim();
  if (value === 'NULL' || value === 'null') return null;
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/""/g, '"');
  }
  if (/^-?\d+\.?\d*$/.test(value)) {
    return parseFloat(value);
  }
  return value;
}

// Parse SQL file
function parseSQLFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const insertMatch = content.match(/INSERT\s+INTO\s+`?(\w+)`?\s+VALUES\s+(.+?);/is);
  
  if (!insertMatch) return null;
  
  const tableName = insertMatch[1];
  const valuesString = insertMatch[2];
  const rowRegex = /\(([^)]+)\)/g;
  const rows = [];
  let rowMatch;
  
  while ((rowMatch = rowRegex.exec(valuesString)) !== null) {
    const values = parseSQLValues(rowMatch[1]);
    rows.push(values);
  }
  
  return { table: tableName, rows };
}

// Column mappings
const COLUMNS = {
  users: ['user_id', 'username', 'email', 'password_hash', 'join_date', 'age', 'most_watched_genre'],
  movies: ['movie_id', 'title', 'release_year', 'genre', 'duration', 'description', 'average_rating', 'poster_url'],
  ratings: ['rating_id', 'user_id', 'movie_id', 'rating_value', 'rating_date'],
  watchhistory: ['history_id', 'user_id', 'movie_id', 'last_watch_date', 'progress'],
  recommendations: ['rec_id', 'user_id', 'movie_id', 'reason'],
  genres: ['genre_id', 'genre_name'],
};

// Convert rows to objects
function rowsToObjects(rows, tableName) {
  const columns = COLUMNS[tableName.toLowerCase()];
  if (!columns) {
    console.warn(`Unknown table: ${tableName}`);
    return rows.map(row => {
      const obj = {};
      row.forEach((val, i) => {
        obj[`col_${i}`] = val;
      });
      return obj;
    });
  }
  
  return rows.map(row => {
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

// Format object as JavaScript code
function formatObject(obj, indent = 2) {
  const spaces = ' '.repeat(indent);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return spaces + formatObject(item, indent + 2) + ',';
      }
      return spaces + JSON.stringify(item) + ',';
    });
    return '[\n' + items.join('\n') + '\n' + ' '.repeat(indent - 2) + ']';
  }
  
  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'string') {
      return `${key}: ${JSON.stringify(value)}`;
    }
    return `${key}: ${JSON.stringify(value)}`;
  });
  
  return '{\n' + spaces + entries.join(',\n' + spaces) + '\n' + ' '.repeat(indent - 2) + '}';
}

// Main function
function syncSQLData() {
  console.log('Syncing SQL files to src/data/sqlData.js...\n');
  
  const sqlFiles = {
    movies: path.join(SQL_DIR, 'movie_recommendations_movies.sql'),
    users: path.join(SQL_DIR, 'movie_recommendations_users.sql'),
    ratings: path.join(SQL_DIR, 'movie_recommendations_ratings.sql'),
    watchHistory: path.join(SQL_DIR, 'movie_recommendations_watchhistory.sql'),
    recommendations: path.join(SQL_DIR, 'movie_recommendations_recommendations.sql'),
    genres: path.join(SQL_DIR, 'movie_recommendations_genres.sql'),
  };
  
  const data = {};
  
  // Parse each SQL file
  for (const [key, filePath] of Object.entries(sqlFiles)) {
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${filePath} not found`);
      continue;
    }
    
    const parsed = parseSQLFile(filePath);
    if (parsed) {
      const objects = rowsToObjects(parsed.rows, parsed.table);
      data[key] = objects;
      console.log(`✓ Parsed ${objects.length} records from ${parsed.table}`);
    } else {
      console.warn(`Warning: Could not parse ${filePath}`);
    }
  }
  
  // Generate output file
  const output = `/**
 * Data extracted from SQL files
 * This file is auto-generated by scripts/sync-sql-data.js
 * DO NOT EDIT MANUALLY - Run 'node scripts/sync-sql-data.js' to update
 * 
 * Last synced: ${new Date().toISOString()}
 */

// Data from movie_recommendations_movies.sql
export const moviesData = ${formatObject(data.movies || [])};

// Data from movie_recommendations_users.sql
export const usersData = ${formatObject(data.users || [])};

// Data from movie_recommendations_ratings.sql
export const ratingsData = ${formatObject(data.ratings || [])};

// Data from movie_recommendations_watchhistory.sql
export const watchHistoryData = ${formatObject(data.watchHistory || [])};

// Data from movie_recommendations_recommendations.sql
export const recommendationsData = ${formatObject(data.recommendations || [])};

// Data from movie_recommendations_genres.sql
export const genresData = ${formatObject(data.genres || [])};
`;
  
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
  console.log(`\n✓ Generated ${OUTPUT_FILE}`);
  console.log('\nSync complete!');
}

// Run if called directly
if (require.main === module) {
  syncSQLData();
}

module.exports = { syncSQLData };

