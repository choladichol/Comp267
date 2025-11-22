import React, { useState, useEffect } from 'react';
import { moviesAPI, ratingsAPI, watchHistoryAPI, recommendationsAPI, genresAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiFilter, FiSearch, FiStar, FiClock, FiTrendingUp } from 'react-icons/fi';
import './AdvancedRecommendationEngine.css';

function AdvancedRecommendationEngine() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    genre: '',
    minRating: '',
    minYear: '',
    maxYear: '',
    minDuration: '',
    maxDuration: '',
    excludeWatched: true,
    minWatchCount: '',
    sortBy: 'rating', // rating, popularity, year, duration
  });
  
  const [genres, setGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const response = await genresAPI.getAll();
      setGenres(response.data || []);
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateAdvancedRecommendations = async () => {
    if (!user?.id) {
      alert('Please log in to generate recommendations');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      // First, generate base recommendations
      await recommendationsAPI.generate(user.id);
      
      // Get user's watch history to exclude watched movies
      const watchHistoryRes = await watchHistoryAPI.getByUser(user.id);
      const watchedMovieIds = (watchHistoryRes.data || []).map(wh => wh.movie_id);
      
      // Get all recommendations
      const recsRes = await recommendationsAPI.getByUser(user.id);
      let filteredRecs = recsRes.data || [];
      
      // Apply filters
      if (filters.excludeWatched) {
        filteredRecs = filteredRecs.filter(rec => !watchedMovieIds.includes(rec.movie_id));
      }
      
      // Get detailed movie data for filtering
      const moviesRes = await moviesAPI.getAll();
      const movies = moviesRes.data || [];
      const movieMap = {};
      movies.forEach(m => {
        movieMap[m.movie_id] = m;
      });
      
      // Apply advanced filters
      filteredRecs = filteredRecs.filter(rec => {
        const movie = movieMap[rec.movie_id];
        if (!movie) {
          console.warn('Movie not found for recommendation:', rec.movie_id);
          return false;
        }
        
        // Genre filter
        if (filters.genre && movie.genre !== filters.genre) return false;
        
        // Rating filter - only apply if value is provided
        if (filters.minRating && filters.minRating !== '') {
          const movieRating = parseFloat(movie.average_rating || 0);
          const minRating = parseFloat(filters.minRating);
          if (movieRating < minRating) return false;
        }
        
        // Year filters
        if (filters.minYear && filters.minYear !== '' && movie.release_year) {
          if (parseInt(movie.release_year) < parseInt(filters.minYear)) return false;
        }
        if (filters.maxYear && filters.maxYear !== '' && movie.release_year) {
          if (parseInt(movie.release_year) > parseInt(filters.maxYear)) return false;
        }
        
        // Duration filters
        if (filters.minDuration && filters.minDuration !== '' && movie.duration) {
          if (parseInt(movie.duration) < parseInt(filters.minDuration)) return false;
        }
        if (filters.maxDuration && filters.maxDuration !== '' && movie.duration) {
          if (parseInt(movie.duration) > parseInt(filters.maxDuration)) return false;
        }
        
        return true;
      });
      
      console.log('Filtered recommendations:', filteredRecs.length, 'out of', recsRes.data?.length || 0);
      
      // Sort results
      filteredRecs = filteredRecs.sort((a, b) => {
        const movieA = movieMap[a.movie_id];
        const movieB = movieMap[b.movie_id];
        
        switch (filters.sortBy) {
          case 'rating':
            return parseFloat(movieB?.average_rating || 0) - parseFloat(movieA?.average_rating || 0);
          case 'popularity':
            return (movieB?.watch_count || 0) - (movieA?.watch_count || 0);
          case 'year':
            return (parseInt(movieB?.release_year || 0) - parseInt(movieA?.release_year || 0));
          case 'duration':
            return (parseInt(movieB?.duration || 0) - parseInt(movieA?.duration || 0));
          default:
            return 0;
        }
      });
      
      // Add movie details to recommendations
      const enrichedRecs = filteredRecs.map(rec => ({
        ...rec,
        movie: movieMap[rec.movie_id]
      }));
      
      setRecommendations(enrichedRecs);
      
      // Provide feedback if no recommendations found
      if (enrichedRecs.length === 0) {
        const watchedCount = watchedMovieIds.length;
        const totalMovies = movies.length;
        let message = 'No recommendations found. ';
        
        if (watchedCount === totalMovies && filters.excludeWatched) {
          message += 'You have watched all available movies! Try unchecking "Exclude Already Watched Movies".';
        } else if (filters.genre || filters.minRating || filters.minYear || filters.maxYear) {
          message += 'Try adjusting your filters - they may be too restrictive.';
        } else {
          message += 'Try generating recommendations again or adjust your preferences.';
        }
        
        setError(message);
      } else {
        setError(''); // Clear any previous errors
      }
    } catch (err) {
      setError('Failed to generate recommendations: ' + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      genre: '',
      minRating: '',
      minYear: '',
      maxYear: '',
      minDuration: '',
      maxDuration: '',
      excludeWatched: true,
      minWatchCount: '',
      sortBy: 'rating',
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Advanced Recommendation Engine</h1>
        <p className="page-subtitle">Generate personalized movie recommendations with advanced filtering</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters Panel */}
      {showFilters && (
        <div className="recommendation-filters">
          <div className="filters-header">
            <h2>
              <FiFilter /> Filter Options
            </h2>
            <button onClick={resetFilters} className="btn-secondary btn-sm">
              Reset Filters
            </button>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.genre_id || genre} value={genre.genre_name || genre}>
                    {genre.genre_name || genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Minimum Rating</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                placeholder="Enter minimum rating (0-5)"
              />
            </div>

            <div className="filter-group">
              <label>Release Year Range</label>
              <div className="range-inputs">
                <input
                  type="number"
                  value={filters.minYear}
                  onChange={(e) => handleFilterChange('minYear', e.target.value)}
                  placeholder="From year"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.maxYear}
                  onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                  placeholder="To year"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Duration Range (minutes)</label>
              <div className="range-inputs">
                <input
                  type="number"
                  value={filters.minDuration}
                  onChange={(e) => handleFilterChange('minDuration', e.target.value)}
                  placeholder="Min minutes"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.maxDuration}
                  onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                  placeholder="Max minutes"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="rating">Rating (High to Low)</option>
                <option value="popularity">Popularity</option>
                <option value="year">Release Year (Newest)</option>
                <option value="duration">Duration (Longest)</option>
              </select>
            </div>

            <div className="filter-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={filters.excludeWatched}
                  onChange={(e) => handleFilterChange('excludeWatched', e.target.checked)}
                />
                Exclude Already Watched Movies
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="generate-section">
        <button
          onClick={generateAdvancedRecommendations}
          disabled={loading}
          className="btn-primary btn-large"
        >
          {loading ? (
            <>Generating Recommendations...</>
          ) : (
            <>
              <FiTrendingUp /> Generate Filtered Recommendations
            </>
          )}
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="recommendations-results">
          <h2>Recommended Movies ({recommendations.length})</h2>
          <div className="recommendations-grid-advanced">
            {recommendations.map(rec => (
              <div key={rec.rec_id} className="recommendation-card-advanced">
                <div className="card-header">
                  <h3>{rec.movie?.title || rec.movie_title || `Movie ${rec.movie_id}`}</h3>
                  {rec.movie?.average_rating && (
                    <div className="rating-badge">
                      <FiStar /> {parseFloat(rec.movie.average_rating).toFixed(1)}
                    </div>
                  )}
                </div>
                
                {rec.movie && (
                  <div className="card-details">
                    <div className="detail-item">
                      <strong>Genre:</strong> {rec.movie.genre || 'N/A'}
                    </div>
                    <div className="detail-item">
                      <strong>Year:</strong> {rec.movie.release_year || 'N/A'}
                    </div>
                    <div className="detail-item">
                      <strong>Duration:</strong> {rec.movie.duration ? `${rec.movie.duration} min` : 'N/A'}
                    </div>
                  </div>
                )}
                
                <div className="recommendation-reason">
                  <strong>Why recommended:</strong> {rec.reason || 'Based on your viewing history'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && !loading && !error && (
        <div className="no-recommendations">
          <p>Click "Generate Filtered Recommendations" to get personalized movie suggestions based on your preferences.</p>
        </div>
      )}
      
      {recommendations.length === 0 && !loading && error && (
        <div className="no-recommendations">
          <p style={{ color: '#c33', fontWeight: '500' }}>{error}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            Tips: Try adjusting your filters, unchecking "Exclude Already Watched Movies", or lowering the minimum rating.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdvancedRecommendationEngine;

