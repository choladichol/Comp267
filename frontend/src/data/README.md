# SQL Data Integration

This directory contains data extracted from your SQL files. The data is used by the mock authentication system to provide realistic test data.

## Files

- `sqlData.js` - Contains all data extracted from SQL dump files

## How It Works

1. **SQL Files** are located in `../movie_recommendations_*.sql`
2. **Data Extraction** - Data is manually extracted or auto-generated using the sync script
3. **Mock API** - The `src/services/api.js` file imports and uses this data when `REACT_APP_MOCK_AUTH=true`

## Updating Data

### Option 1: Manual Update
Edit `sqlData.js` directly when your SQL files change.

### Option 2: Auto-Sync (Recommended)
Run the sync script to automatically extract data from SQL files:

```bash
node scripts/sync-sql-data.js
```

This will:
- Read all SQL dump files
- Parse INSERT statements
- Generate `sqlData.js` with the latest data

## SQL Files Location

All SQL files are now located in: **`src/data/sql/`**

- ✅ `sql/movie_recommendations_movies.sql` → `moviesData`
- ✅ `sql/movie_recommendations_users.sql` → `usersData`
- ✅ `sql/movie_recommendations_ratings.sql` → `ratingsData`
- ✅ `sql/movie_recommendations_watchhistory.sql` → `watchHistoryData`
- ✅ `sql/movie_recommendations_recommendations.sql` → `recommendationsData`
- ✅ `sql/movie_recommendations_genres.sql` → `genresData`
- ✅ `sql/Phase_2code.sql` (main schema file)

## Notes

- Data is enriched with relationships (e.g., ratings include movie titles and usernames)
- The mock system maintains data consistency across all tables
- Changes to SQL files should be synced to keep frontend and database in sync

