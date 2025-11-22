import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ratingsAPI, moviesAPI, usersAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './RatingForm.css';

function RatingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    user_id: user?.id || '',
    movie_id: '',
    rating_value: '',
    rating_date: new Date().toISOString().split('T')[0],
  });
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovies();
    if (user?.role !== 'end_user') {
      loadUsers();
    }
    if (isEdit) {
      loadRating();
    }
  }, [id, user]);

  const loadMovies = async () => {
    try {
      const response = await moviesAPI.getAll();
      setMovies(response.data);
    } catch (err) {
      console.error('Failed to load movies:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadRating = async () => {
    try {
      const response = await ratingsAPI.getById(id);
      const rating = response.data;
      setFormData({
        user_id: rating.user_id || user?.id || '',
        movie_id: rating.movie_id || '',
        rating_value: rating.rating_value || '',
        rating_date: rating.rating_date || new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError('Failed to load rating');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        user_id: parseInt(formData.user_id),
        movie_id: parseInt(formData.movie_id),
        rating_value: parseFloat(formData.rating_value),
      };

      if (isEdit) {
        await ratingsAPI.update(id, data);
        alert('Rating updated successfully');
      } else {
        await ratingsAPI.create(data);
        alert('Rating created successfully');
      }
      navigate('/ratings');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save rating');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Rating' : 'Add New Rating'}</h1>
        <button onClick={() => navigate('/ratings')} className="btn-secondary">
          Cancel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        {user?.role !== 'end_user' && (
          <div className="form-group">
            <label>User *</label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u.user_id} value={u.user_id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Movie *</label>
          <select
            name="movie_id"
            value={formData.movie_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Movie</option>
            {movies.map(m => (
              <option key={m.movie_id} value={m.movie_id}>
                {m.title} ({m.release_year})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Rating (1-5) *</label>
          <input
            type="number"
            name="rating_value"
            value={formData.rating_value}
            onChange={handleChange}
            min="1"
            max="5"
            step="0.1"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Rating Date *</label>
          <input
            type="date"
            name="rating_date"
            value={formData.rating_date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : isEdit ? 'Update Rating' : 'Create Rating'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/ratings')}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default RatingForm;


