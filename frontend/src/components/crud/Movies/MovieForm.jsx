import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { moviesAPI, genresAPI } from '../../../services/api';
import './MovieForm.css';

function MovieForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    release_year: '',
    genre: '',
    duration: '',
    description: '',
    poster_url: '',
  });
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGenres();
    if (isEdit) {
      loadMovie();
    }
  }, [id]);

  const loadGenres = async () => {
    try {
      const response = await genresAPI.getAll();
      setGenres(response.data);
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
  };

  const loadMovie = async () => {
    try {
      const response = await moviesAPI.getById(id);
      const movie = response.data;
      setFormData({
        title: movie.title || '',
        release_year: movie.release_year || '',
        genre: movie.genre || '',
        duration: movie.duration || '',
        description: movie.description || '',
        poster_url: movie.poster_url || '',
      });
    } catch (err) {
      setError('Failed to load movie');
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
        release_year: formData.release_year ? parseInt(formData.release_year) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
      };

      if (isEdit) {
        await moviesAPI.update(id, data);
        alert('Movie updated successfully');
      } else {
        await moviesAPI.create(data);
        alert('Movie created successfully');
      }
      navigate('/movies');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save movie');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Movie' : 'Add New Movie'}</h1>
        <button onClick={() => navigate('/movies')} className="btn-secondary">
          Cancel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Release Year</label>
            <input
              type="number"
              name="release_year"
              value={formData.release_year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Genre</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select Genre</option>
            {genres.map(genre => (
              <option key={genre.genre_id} value={genre.genre_name}>
                {genre.genre_name}
              </option>
            ))}
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Horror">Horror</option>
          </select>
        </div>

        <div className="form-group">
          <label>Poster URL</label>
          <input
            type="url"
            name="poster_url"
            value={formData.poster_url}
            onChange={handleChange}
            placeholder="https://example.com/poster.jpg"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : isEdit ? 'Update Movie' : 'Create Movie'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/movies')}
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

export default MovieForm;


