import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { exportToCSV } from '../../utils/exportUtils';
import { FiDownload } from 'react-icons/fi';
import './Reports.css';

function OverdueRecommendationsReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await reportsAPI.getOverdueRecommendations();
      setData(response.data || []);
    } catch (err) {
      setError('Failed to load overdue recommendations report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(data, 'overdue_recommendations_report');
  };

  if (loading) return <div className="loading">Loading report...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <h2>Overdue Recommendations Report</h2>
          <p className="report-description">Recommendations using DATE functions and subqueries</p>
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
              <th>User</th>
              <th>Movie</th>
              <th>Reason</th>
              <th>Created Date</th>
              <th>Days Pending</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No overdue recommendations found</td>
              </tr>
            ) : (
              data.map((rec, index) => (
                <tr key={rec.rec_id || index}>
                  <td><strong>{rec.username || `User ${rec.user_id}`}</strong></td>
                  <td>{rec.title || `Movie ${rec.movie_id}`}</td>
                  <td>{rec.reason || 'N/A'}</td>
                  <td>{rec.created_date || 'N/A'}</td>
                  <td><strong>{rec.days_pending || 0} days</strong></td>
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
              <strong>Total Overdue:</strong> {data.length}
            </div>
            <div className="aggregate-item">
              <strong>Average Days Pending:</strong> {
                (data.reduce((sum, r) => sum + (parseInt(r.days_pending) || 0), 0) / data.length).toFixed(2)
              }
            </div>
            <div className="aggregate-item">
              <strong>Max Days Pending:</strong> {
                Math.max(...data.map(r => parseInt(r.days_pending) || 0))
              }
            </div>
            <div className="aggregate-item">
              <strong>Min Days Pending:</strong> {
                Math.min(...data.map(r => parseInt(r.days_pending) || 0))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OverdueRecommendationsReport;


