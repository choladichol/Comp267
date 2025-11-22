import React, { useState } from 'react';
import { queriesAPI } from '../../services/api';
import './Advanced.css';

function QueryExecutor() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);

  const exampleQueries = [
    {
      name: 'Movies with Above-Average Ratings (Subquery)',
      query: `SELECT * FROM movies 
WHERE average_rating > (
  SELECT AVG(average_rating) FROM movies WHERE average_rating > 0
)
ORDER BY average_rating DESC`
    },
    {
      name: 'Users Who Watched More Than 3 Movies (HAVING)',
      query: `SELECT u.username, COUNT(wh.movie_id) as movies_watched
FROM users u
JOIN watchhistory wh ON u.user_id = wh.user_id
GROUP BY u.user_id, u.username
HAVING COUNT(wh.movie_id) > 3`
    },
    {
      name: 'Top Rated Movies by Genre (Subquery with IN)',
      query: `SELECT genre, title, average_rating
FROM movies
WHERE (genre, average_rating) IN (
  SELECT genre, MAX(average_rating)
  FROM movies
  GROUP BY genre
)
ORDER BY genre`
    },
    {
      name: 'Movies Not in Watch History (NOT EXISTS Subquery)',
      query: `SELECT m.movie_id, m.title, m.genre, m.average_rating
FROM movies m
WHERE NOT EXISTS (
  SELECT 1 FROM watchhistory wh 
  WHERE wh.movie_id = m.movie_id
)
ORDER BY m.average_rating DESC`
    },
    {
      name: 'Users with Highest Average Rating (Aggregate Subquery)',
      query: `SELECT u.username, 
  (SELECT AVG(rating_value) 
   FROM ratings r 
   WHERE r.user_id = u.user_id) as avg_user_rating
FROM users u
WHERE (SELECT AVG(rating_value) 
       FROM ratings r 
       WHERE r.user_id = u.user_id) > (
  SELECT AVG(rating_value) FROM ratings
)
ORDER BY avg_user_rating DESC`
    },
    {
      name: 'Genre Popularity with Aggregate Functions',
      query: `SELECT 
  genre,
  COUNT(*) as total_movies,
  AVG(average_rating) as avg_rating,
  MAX(average_rating) as max_rating,
  MIN(average_rating) as min_rating,
  SUM(CASE WHEN average_rating >= 4.0 THEN 1 ELSE 0 END) as highly_rated_count
FROM movies
WHERE genre IS NOT NULL
GROUP BY genre
HAVING COUNT(*) > 1
ORDER BY avg_rating DESC`
    },
    {
      name: 'Correlated Subquery: Movies Better Than Genre Average',
      query: `SELECT m1.title, m1.genre, m1.average_rating,
  (SELECT AVG(m2.average_rating) 
   FROM movies m2 
   WHERE m2.genre = m1.genre) as genre_avg
FROM movies m1
WHERE m1.average_rating > (
  SELECT AVG(m2.average_rating) 
  FROM movies m2 
  WHERE m2.genre = m1.genre
)
ORDER BY m1.genre, m1.average_rating DESC`
    }
  ];

  const handleExecute = async () => {
    if (!query.trim()) {
      alert('Please enter a SQL query');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await queriesAPI.execute(query);
      setResults(response.data || []);
      setQueryHistory([...queryHistory, { query, timestamp: new Date() }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute query');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadExampleQuery = (exampleQuery) => {
    setQuery(exampleQuery);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Query Executor</h1>
      </div>

      <div className="query-executor">
        <div className="query-input-section">
          <h2>Enter SQL Query</h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SELECT * FROM movies WHERE average_rating > 4.0"
            rows="8"
            className="query-textarea"
          />
          <div className="query-actions">
            <button onClick={handleExecute} disabled={loading} className="btn-primary">
              {loading ? 'Executing...' : 'Execute Query'}
            </button>
            <button onClick={() => setQuery('')} className="btn-secondary">
              Clear
            </button>
          </div>
        </div>

        <div className="example-queries">
          <h3>Example Queries</h3>
          <ul>
            {exampleQueries.map((example, index) => (
              <li key={index}>
                <button
                  onClick={() => loadExampleQuery(example.query)}
                  className="example-query-btn"
                >
                  {example.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {error && <div className="error-message">{error}</div>}

        {results.length > 0 && (
          <div className="query-results">
            <h2>Query Results ({results.length} rows)</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(results[0]).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {queryHistory.length > 0 && (
          <div className="query-history">
            <h3>Query History</h3>
            <ul>
              {queryHistory.slice(-5).reverse().map((item, index) => (
                <li key={index}>
                  <small>{item.timestamp.toLocaleTimeString()}</small>
                  <code>{item.query.substring(0, 100)}...</code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default QueryExecutor;


