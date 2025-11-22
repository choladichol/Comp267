import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moviesAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { canDelete, canUpdate, canCreate } from '../../../utils/rolePermissions';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [filter, setFilter] = useState({ genre: '', search: '' });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await moviesAPI.getAll();
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await moviesAPI.delete(id);
      setMovies(movies.filter(m => m.movie_id !== id));
      alert('Movie deleted successfully');
    } catch (err) {
      alert('Failed to delete movie');
      console.error(err);
    }
  };

  const filteredMovies = movies.filter(movie => {
    const matchesGenre = !filter.genre || movie.genre === filter.genre;
    const matchesSearch = !filter.search || 
      movie.title.toLowerCase().includes(filter.search.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const genres = [...new Set(movies.map(m => m.genre).filter(Boolean))];

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Movies</h1>
        {canCreate(user?.role) && (
          <Link to="/movies/new" className="btn-primary">
            <FiPlus /> Add New Movie
          </Link>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search movies..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filter.genre}
          onChange={(e) => setFilter({ ...filter, genre: e.target.value })}
          className="filter-select"
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Movies Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Duration</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No movies found</td>
              </tr>
            ) : (
              filteredMovies.map(movie => (
                <tr key={movie.movie_id}>
                  <td>{movie.movie_id}</td>
                  <td>
                    <Link to={`/movies/${movie.movie_id}`} className="movie-link">
                      {movie.title}
                    </Link>
                  </td>
                  <td>{movie.genre || 'N/A'}</td>
                  <td>{movie.release_year || 'N/A'}</td>
                  <td>{movie.duration ? `${movie.duration} min` : 'N/A'}</td>
                  <td>{movie.average_rating ? parseFloat(movie.average_rating).toFixed(2) : '0.00'}</td>
                  <td className="actions">
                    {canUpdate(user?.role) && (
                      <Link to={`/movies/${movie.movie_id}/edit`} className="btn-icon">
                        <FiEdit />
                      </Link>
                    )}
                    {canDelete(user?.role) && (
                      <button
                        onClick={() => handleDelete(movie.movie_id, movie.title)}
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

export default MovieList;


