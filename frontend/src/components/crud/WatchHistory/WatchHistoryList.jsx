import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { watchHistoryAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { canDelete, canUpdate, canCreate, canDeleteItem } from '../../../utils/rolePermissions';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './WatchHistoryList.css';

function WatchHistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      let response;
      if (user?.role === 'end_user') {
        response = await watchHistoryAPI.getByUser(user.id);
      } else {
        response = await watchHistoryAPI.getAll();
      }
      setHistory(response.data || []);
    } catch (err) {
      setError('Failed to load watch history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watch history entry?')) {
      return;
    }

    try {
      await watchHistoryAPI.delete(id);
      setHistory(history.filter(h => h.history_id !== id));
      alert('Watch history deleted successfully');
    } catch (err) {
      alert('Failed to delete watch history');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading watch history...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Watch History</h1>
        <Link to="/watch-history/new" className="btn-primary">
          <FiPlus /> Add New Entry
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Movie</th>
              <th>Last Watch Date</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No watch history found</td>
              </tr>
            ) : (
              history.map(entry => (
                <tr key={entry.history_id}>
                  <td>{entry.history_id}</td>
                  <td>{entry.username || `User ${entry.user_id}`}</td>
                  <td>{entry.movie_title || `Movie ${entry.movie_id}`}</td>
                  <td>{entry.last_watch_date}</td>
                  <td>{entry.progress || '0%'}</td>
                  <td className="actions">
                    {(canUpdate(user?.role) || entry.user_id === user?.id) && (
                      <Link to={`/watch-history/${entry.history_id}/edit`} className="btn-icon">
                        <FiEdit />
                      </Link>
                    )}
                    {canDeleteItem(user?.role, entry.user_id, user?.id) && (
                      <button
                        onClick={() => handleDelete(entry.history_id)}
                        className="btn-icon btn-danger"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WatchHistoryList;


