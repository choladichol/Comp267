import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { exportToCSV } from '../../utils/exportUtils';
import { FiDownload } from 'react-icons/fi';
import './Reports.css';

function UserActivityReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await reportsAPI.getUserActivity();
      setData(response.data || []);
    } catch (err) {
      setError('Failed to load user activity report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(data, 'user_activity_report');
  };

  if (loading) return <div className="loading">Loading report...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <h2>User Activity Report</h2>
          <p className="report-description">User engagement metrics using COUNT, MAX, MIN aggregates</p>
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
              <th>Username</th>
              <th>Join Date</th>
              <th>Months Since Join</th>
              <th>Movies Watched</th>
              <th>Ratings Provided</th>
              <th>Most Watched Genre</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No data available</td>
              </tr>
            ) : (
              data.map((user, index) => (
                <tr key={user.user_id || index}>
                  <td><strong>{user.username || 'N/A'}</strong></td>
                  <td>{user.join_date || 'N/A'}</td>
                  <td>{user.months_since_join || 0}</td>
                  <td>{user.unique_movies_watched || user.movies_watched || 0}</td>
                  <td>{user.ratings_provided || user.ratings_given || 0}</td>
                  <td>{user.most_watched_genre || 'N/A'}</td>
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
              <strong>Total Users:</strong> {data.length}
            </div>
            <div className="aggregate-item">
              <strong>Total Movies Watched:</strong> {
                data.reduce((sum, u) => sum + (parseInt(u.unique_movies_watched || u.movies_watched) || 0), 0)
              }
            </div>
            <div className="aggregate-item">
              <strong>Total Ratings Provided:</strong> {
                data.reduce((sum, u) => sum + (parseInt(u.ratings_provided || u.ratings_given) || 0), 0)
              }
            </div>
            <div className="aggregate-item">
              <strong>Max Movies Watched:</strong> {
                Math.max(...data.map(u => parseInt(u.unique_movies_watched || u.movies_watched) || 0))
              }
            </div>
            <div className="aggregate-item">
              <strong>Average Movies Watched:</strong> {
                (data.reduce((sum, u) => sum + (parseInt(u.unique_movies_watched || u.movies_watched) || 0), 0) / data.length).toFixed(2)
              }
            </div>
            <div className="aggregate-item">
              <strong>Average Ratings Per User:</strong> {
                (data.reduce((sum, u) => sum + (parseInt(u.ratings_provided || u.ratings_given) || 0), 0) / data.length).toFixed(2)
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserActivityReport;


