import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ratingsAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { canDelete, canUpdate, canCreate, canDeleteItem } from '../../../utils/rolePermissions';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './RatingList.css';

function RatingList() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      let response;
      if (user?.role === 'end_user') {
        response = await ratingsAPI.getByUser(user.id);
      } else {
        response = await ratingsAPI.getAll();
      }
      setRatings(response.data || []);
    } catch (err) {
      setError('Failed to load ratings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      await ratingsAPI.delete(id);
      setRatings(ratings.filter(r => r.rating_id !== id));
      alert('Rating deleted successfully');
    } catch (err) {
      alert('Failed to delete rating');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading ratings...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Ratings</h1>
        <Link to="/ratings/new" className="btn-primary">
          <FiPlus /> Add New Rating
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
              <th>Rating</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ratings.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No ratings found</td>
              </tr>
            ) : (
              ratings.map(rating => (
                <tr key={rating.rating_id}>
                  <td>{rating.rating_id}</td>
                  <td>{rating.username || `User ${rating.user_id}`}</td>
                  <td>{rating.movie_title || `Movie ${rating.movie_id}`}</td>
                  <td>{parseFloat(rating.rating_value).toFixed(1)} / 5.0</td>
                  <td>{rating.rating_date}</td>
                  <td className="actions">
                    {(canUpdate(user?.role) || rating.user_id === user?.id) && (
                      <Link to={`/ratings/${rating.rating_id}/edit`} className="btn-icon">
                        <FiEdit />
                      </Link>
                    )}
                    {canDeleteItem(user?.role, rating.user_id, user?.id) && (
                      <button
                        onClick={() => handleDelete(rating.rating_id)}
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

export default RatingList;


