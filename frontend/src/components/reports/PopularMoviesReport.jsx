import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { exportToCSV } from '../../utils/exportUtils';
import { FiDownload } from 'react-icons/fi';
import './Reports.css';

function PopularMoviesReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await reportsAPI.getPopularMovies();
      setData(response.data || []);
    } catch (err) {
      setError('Failed to load popular movies report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(data, 'popular_movies_report');
  };

  if (loading) return <div className="loading">Loading report...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <h2>Popular Movies Report</h2>
          <p className="report-description">Movies ranked by watch count and average rating (Uses COUNT, AVG aggregates)</p>
        </div>
        {data.length > 0 && (
          <button onClick={handleExport} className="btn-export">
            <FiDownload /> Export to CSV
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Genre</th>
              <th>Watch Count</th>
              <th>Rating Count</th>
              <th>Average Rating</th>
              <th>Overall Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No data available</td>
              </tr>
            ) : (
              data.map((movie, index) => (
                <tr key={movie.movie_id || index}>
                  <td>{movie.title || 'N/A'}</td>
                  <td>{movie.genre || 'N/A'}</td>
                  <td>{movie.watch_count || 0}</td>
                  <td>{movie.rating_count || 0}</td>
                  <td>{movie.average_rating ? parseFloat(movie.average_rating).toFixed(2) : '0.00'}</td>
                  <td>{movie.overall_rating ? parseFloat(movie.overall_rating).toFixed(2) : '0.00'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Aggregate Summary */}
      {data.length > 0 && (
        <div className="aggregate-summary">
          <h3>Aggregate Statistics</h3>
          <div className="aggregate-grid">
            <div className="aggregate-item">
              <strong>Total Movies:</strong> {data.length}
            </div>
            <div className="aggregate-item">
              <strong>Total Watches:</strong> {data.reduce((sum, m) => sum + (parseInt(m.watch_count) || 0), 0)}
            </div>
            <div className="aggregate-item">
              <strong>Total Ratings:</strong> {data.reduce((sum, m) => sum + (parseInt(m.rating_count) || 0), 0)}
            </div>
            <div className="aggregate-item">
              <strong>Average Rating (All):</strong> {
                (data.reduce((sum, m) => sum + (parseFloat(m.average_rating) || 0), 0) / data.length).toFixed(2)
              }
            </div>
            <div className="aggregate-item">
              <strong>Max Rating:</strong> {
                Math.max(...data.map(m => parseFloat(m.average_rating) || 0)).toFixed(2)
              }
            </div>
            <div className="aggregate-item">
              <strong>Min Rating:</strong> {
                Math.min(...data.map(m => parseFloat(m.average_rating) || 0)).toFixed(2)
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopularMoviesReport;


