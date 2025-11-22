import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { watchHistoryAPI, moviesAPI, usersAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './WatchHistoryForm.css';

function WatchHistoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    user_id: user?.id || '',
    movie_id: '',
    last_watch_date: new Date().toISOString().split('T')[0],
    progress: '0%',
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
      loadHistory();
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

  const loadHistory = async () => {
    try {
      const response = await watchHistoryAPI.getById(id);
      const entry = response.data;
      setFormData({
        user_id: entry.user_id || user?.id || '',
        movie_id: entry.movie_id || '',
        last_watch_date: entry.last_watch_date || new Date().toISOString().split('T')[0],
        progress: entry.progress || '0%',
      });
    } catch (err) {
      setError('Failed to load watch history');
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
      };

      if (isEdit) {
        await watchHistoryAPI.update(id, data);
        alert('Watch history updated successfully');
      } else {
        await watchHistoryAPI.create(data);
        alert('Watch history created successfully');
      }
      navigate('/watch-history');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save watch history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Watch History' : 'Add New Watch History'}</h1>
        <button onClick={() => navigate('/watch-history')} className="btn-secondary">
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

        <div className="form-row">
          <div className="form-group">
            <label>Last Watch Date *</label>
            <input
              type="date"
              name="last_watch_date"
              value={formData.last_watch_date}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Progress *</label>
            <input
              type="text"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              placeholder="e.g., 50% or 100%"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : isEdit ? 'Update Entry' : 'Create Entry'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/watch-history')}
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

export default WatchHistoryForm;


