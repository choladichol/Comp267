import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { exportToCSV } from '../../utils/exportUtils';
import { FiDownload } from 'react-icons/fi';
import './Reports.css';

function GenreStatisticsReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await reportsAPI.getGenreStatistics();
      setData(response.data || []);
    } catch (err) {
      setError('Failed to load genre statistics report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(data, 'genre_statistics_report');
  };

  if (loading) return <div className="loading">Loading report...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <h2>Genre Statistics Report</h2>
          <p className="report-description">Statistics for each genre using COUNT, AVG, SUM aggregates</p>
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
              <th>Genre</th>
              <th>Total Movies</th>
              <th>Average Rating</th>
              <th>Unique Watchers</th>
              <th>Total Watches</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No data available</td>
              </tr>
            ) : (
              data.map((genre, index) => (
                <tr key={genre.genre_name || index}>
                  <td><strong>{genre.genre_name || 'N/A'}</strong></td>
                  <td>{genre.movie_count || genre.total_movies || 0}</td>
                  <td>{genre.avg_rating || genre.avg_genre_rating ? parseFloat(genre.avg_rating || genre.avg_genre_rating).toFixed(2) : '0.00'}</td>
                  <td>{genre.unique_watchers || 0}</td>
                  <td>{genre.total_watches || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Aggregate Summary */}
      {data.length > 0 && (
        <div className="aggregate-summary">
          <h3>Overall Aggregate Statistics</h3>
          <div className="aggregate-grid">
            <div className="aggregate-item">
              <strong>Total Genres:</strong> {data.length}
            </div>
            <div className="aggregate-item">
              <strong>Total Movies (All Genres):</strong> {
                data.reduce((sum, g) => sum + (parseInt(g.movie_count || g.total_movies) || 0), 0)
              }
            </div>
            <div className="aggregate-item">
              <strong>Total Watches (All Genres):</strong> {
                data.reduce((sum, g) => sum + (parseInt(g.total_watches) || 0), 0)
              }
            </div>
            <div className="aggregate-item">
              <strong>Average Rating (All Genres):</strong> {
                (data.reduce((sum, g) => sum + (parseFloat(g.avg_rating || g.avg_genre_rating) || 0), 0) / data.length).toFixed(2)
              }
            </div>
            <div className="aggregate-item">
              <strong>Max Genre Rating:</strong> {
                Math.max(...data.map(g => parseFloat(g.avg_rating || g.avg_genre_rating) || 0)).toFixed(2)
              }
            </div>
            <div className="aggregate-item">
              <strong>Total Unique Watchers:</strong> {
                data.reduce((sum, g) => sum + (parseInt(g.unique_watchers) || 0), 0)
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenreStatisticsReport;


