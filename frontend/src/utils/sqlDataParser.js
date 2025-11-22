/**
 * Utility to parse SQL INSERT statements and extract data
 * This allows the frontend to use data directly from SQL files
 */

/**
 * Parse SQL INSERT statement and extract data
 * @param {string} sqlContent - SQL file content
 * @returns {Array} Array of objects representing the data
 */
export const parseSQLInserts = (sqlContent) => {
  const inserts = [];
  
  // Find all INSERT INTO statements
  const insertRegex = /INSERT\s+INTO\s+`?(\w+)`?\s+VALUES\s+(.+?);/gis;
  let match;
  
  while ((match = insertRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    const valuesString = match[2];
    
    // Parse the VALUES part - handle both single and multiple rows
    const rowRegex = /\(([^)]+)\)/g;
    const rows = [];
    let rowMatch;
    
    while ((rowMatch = rowRegex.exec(valuesString)) !== null) {
      const values = rowMatch[1];
      // Split by comma, but handle quoted strings
      const parsedValues = parseSQLValues(values);
      rows.push(parsedValues);
    }
    
    inserts.push({ table: tableName, rows });
  }
  
  return inserts;
};

/**
 * Parse SQL values string into array
 * Handles strings, numbers, NULL, and dates
 */
const parseSQLValues = (valuesString) => {
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
      // Skip comma if present
      if (nextChar === ',') i++;
      continue;
    }
    
    if (inQuotes && char === quoteChar && nextChar === quoteChar) {
      // Escaped quote
      current += char;
      i++; // Skip next quote
      continue;
    }
    
    if (!inQuotes && char === ',') {
      const trimmed = current.trim();
      if (trimmed) {
        values.push(parseSQLValue(trimmed));
      }
      current = '';
      continue;
    }
    
    current += char;
  }
  
  // Add last value
  const trimmed = current.trim();
  if (trimmed) {
    values.push(parseSQLValue(trimmed));
  }
  
  return values;
};

/**
 * Parse a single SQL value
 */
const parseSQLValue = (value) => {
  value = value.trim();
  
  if (value === 'NULL' || value === 'null') {
    return null;
  }
  
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/""/g, '"');
  }
  
  // Try to parse as number
  if (/^-?\d+\.?\d*$/.test(value)) {
    return parseFloat(value);
  }
  
  return value;
};

/**
 * Convert SQL data to object format with column names
 * This requires the table structure to be known
 */
export const sqlDataToObjects = (sqlData, columnMap) => {
  return sqlData.rows.map(row => {
    const obj = {};
    columnMap.forEach((colName, index) => {
      obj[colName] = row[index];
    });
    return obj;
  });
};

/**
 * Table column mappings based on SQL schema
 */
export const TABLE_COLUMNS = {
  users: ['user_id', 'username', 'email', 'password_hash', 'join_date', 'age', 'most_watched_genre'],
  movies: ['movie_id', 'title', 'release_year', 'genre', 'duration', 'description', 'average_rating', 'poster_url'],
  ratings: ['rating_id', 'user_id', 'movie_id', 'rating_value', 'rating_date'],
  watchhistory: ['history_id', 'user_id', 'movie_id', 'last_watch_date', 'progress'],
  recommendations: ['rec_id', 'user_id', 'movie_id', 'reason'],
  genres: ['genre_id', 'genre_name'],
};

/**
 * Load and parse SQL file data
 * Note: In a real scenario, you'd fetch these files or import them
 * For now, this provides the parsing utilities
 */
export const loadSQLData = async (sqlFilePath) => {
  try {
    // In browser environment, we can't directly read files
    // This would need to be done at build time or via a backend
    // For now, return the utility functions
    return null;
  } catch (error) {
    console.error('Error loading SQL file:', error);
    return null;
  }
};

