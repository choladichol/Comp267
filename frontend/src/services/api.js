import axios from 'axios';
import { 
  moviesData, 
  usersData, 
  ratingsData, 
  watchHistoryData, 
  recommendationsData, 
  genresData 
} from '../data/sqlData';

// Base URL - Update this with your backend API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
// Development mode: Set to true to use mock authentication (for testing without backend)
const MOCK_AUTH = process.env.REACT_APP_MOCK_AUTH === 'true' || false;

// Mock users for development/testing (matches SQL sample data)
const MOCK_USERS = {
  'john@email.com': { password: 'password123', user: { id: 1, username: 'john_doe', email: 'john@email.com', role: 'end_user' } },
  'jane@email.com': { password: 'password123', user: { id: 2, username: 'jane_smith', email: 'jane@email.com', role: 'manager' } },
  'mike@email.com': { password: 'password123', user: { id: 3, username: 'mike_wilson', email: 'mike@email.com', role: 'admin' } },
};

// ==================== MOCK DATA STORAGE ====================
// Store mock data in localStorage for persistence across page refreshes
const getMockData = (key) => {
  const stored = localStorage.getItem(`mock_${key}`);
  return stored ? JSON.parse(stored) : null;
};

const setMockData = (key, data) => {
  localStorage.setItem(`mock_${key}`, JSON.stringify(data));
};

// Initialize mock data if not exists - using actual SQL data
const initMockData = () => {
  const MOCK_DATA_VERSION = '3.0'; // Version to track SQL-based data (expanded dataset)
  const currentVersion = getMockData('version');
  
  // If version doesn't match or data doesn't exist, reinitialize
  if (currentVersion !== MOCK_DATA_VERSION || !getMockData('movies')) {
    // Clear old data
    localStorage.removeItem('mock_movies');
    localStorage.removeItem('mock_ratings');
    localStorage.removeItem('mock_watchHistory');
    localStorage.removeItem('mock_recommendations');
    localStorage.removeItem('mock_genres');
    localStorage.removeItem('mock_nextId');
    
    // Load data directly from SQL files (via sqlData.js)
    // Movies from movie_recommendations_movies.sql
    setMockData('movies', [...moviesData]);

    // Create movie map for relationships
    const movieMap = {};
    moviesData.forEach(m => { movieMap[m.movie_id] = m.title; });
    
    // Create user map for relationships
    const userMap = {};
    usersData.forEach(u => { userMap[u.user_id] = u.username; });
    
    // Ratings from movie_recommendations_ratings.sql
    // Enrich with movie and user names
    const enrichedRatings = ratingsData.map(rating => ({
      ...rating,
      username: userMap[rating.user_id] || `User ${rating.user_id}`,
      movie_title: movieMap[rating.movie_id] || `Movie ${rating.movie_id}`,
    }));
    setMockData('ratings', enrichedRatings);

    // Watch History from movie_recommendations_watchhistory.sql
    // Enrich with movie and user names, add watch_date for compatibility
    const enrichedWatchHistory = watchHistoryData.map(history => ({
      ...history,
      watch_date: history.last_watch_date, // Add watch_date alias
      username: userMap[history.user_id] || `User ${history.user_id}`,
      movie_title: movieMap[history.movie_id] || `Movie ${history.movie_id}`,
    }));
    setMockData('watchHistory', enrichedWatchHistory);

    // Recommendations from movie_recommendations_recommendations.sql
    // Enrich with movie and user names
    const enrichedRecommendations = recommendationsData.map(rec => ({
      ...rec,
      username: userMap[rec.user_id] || `User ${rec.user_id}`,
      movie_title: movieMap[rec.movie_id] || `Movie ${rec.movie_id}`,
    }));
    setMockData('recommendations', enrichedRecommendations);

    // Genres from movie_recommendations_genres.sql
    setMockData('genres', [...genresData]);

    setMockData('nextId', { movies: 116, ratings: 23, watchHistory: 22, recommendations: 16 });
    
    // Set version
    setMockData('version', MOCK_DATA_VERSION);
  }
};

// Initialize mock data on load
if (MOCK_AUTH) {
  initMockData();
}

// Helper to simulate API delay
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const authAPI = {
  login: async (email, password) => {
    // Mock authentication for development
    if (MOCK_AUTH) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUser = MOCK_USERS[email.toLowerCase()];
      if (mockUser && mockUser.password === password) {
        // Generate a fake token
        const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return { data: { token: mockToken, user: mockUser.user } };
      } else {
        throw { response: { data: { error: 'Invalid email or password' } } };
      }
    }
    
    // Real API call
    return api.post('/auth/login', { email, password });
  },
  logout: () => {
    if (MOCK_AUTH) {
      // Mock logout - just return success
      return Promise.resolve({ data: { message: 'Logged out successfully' } });
    }
    return api.post('/auth/logout');
  },
};

// ==================== MOVIES API ====================
export const moviesAPI = {
  getAll: async () => {
    if (MOCK_AUTH) {
      await mockDelay();
      const movies = getMockData('movies') || [];
      return { data: movies };
    }
    return api.get('/movies');
  },
  getById: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const movies = getMockData('movies') || [];
      const movie = movies.find(m => m.movie_id === parseInt(id));
      if (!movie) throw { response: { status: 404, data: { error: 'Movie not found' } } };
      return { data: movie };
    }
    return api.get(`/movies/${id}`);
  },
  create: async (movieData) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const movies = getMockData('movies') || [];
      const nextId = getMockData('nextId')?.movies || movies.length + 1;
      const newMovie = {
        movie_id: nextId,
        ...movieData,
        average_rating: movieData.average_rating || 0,
      };
      movies.push(newMovie);
      setMockData('movies', movies);
      setMockData('nextId', { ...getMockData('nextId'), movies: nextId + 1 });
      return { data: newMovie };
    }
    return api.post('/movies', movieData);
  },
  update: async (id, movieData) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const movies = getMockData('movies') || [];
      const index = movies.findIndex(m => m.movie_id === parseInt(id));
      if (index === -1) throw { response: { status: 404, data: { error: 'Movie not found' } } };
      movies[index] = { ...movies[index], ...movieData };
      setMockData('movies', movies);
      return { data: movies[index] };
    }
    return api.put(`/movies/${id}`, movieData);
  },
  delete: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const movies = getMockData('movies') || [];
      const filtered = movies.filter(m => m.movie_id !== parseInt(id));
      if (filtered.length === movies.length) {
        throw { response: { status: 404, data: { error: 'Movie not found' } } };
      }
      setMockData('movies', filtered);
      return { data: { message: 'Movie deleted successfully' } };
    }
    return api.delete(`/movies/${id}`);
  },
};

// ==================== RATINGS API ====================
export const ratingsAPI = {
  getAll: async () => {
    if (MOCK_AUTH) {
      await mockDelay();
      const ratings = getMockData('ratings') || [];
      return { data: ratings };
    }
    return api.get('/ratings');
  },
  getById: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const ratings = getMockData('ratings') || [];
      const rating = ratings.find(r => r.rating_id === parseInt(id));
      if (!rating) throw { response: { status: 404, data: { error: 'Rating not found' } } };
      return { data: rating };
    }
    return api.get(`/ratings/${id}`);
  },
  getByUser: async (userId) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const ratings = getMockData('ratings') || [];
      const userRatings = ratings.filter(r => r.user_id === parseInt(userId));
      return { data: userRatings };
    }
    return api.get(`/ratings/user/${userId}`);
  },
  getByMovie: async (movieId) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const ratings = getMockData('ratings') || [];
      const movieRatings = ratings.filter(r => r.movie_id === parseInt(movieId));
      return { data: movieRatings };
    }
    return api.get(`/ratings/movie/${movieId}`);
  },
  create: async (ratingData) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const ratings = getMockData('ratings') || [];
      const nextId = getMockData('nextId')?.ratings || ratings.length + 1;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const movies = getMockData('movies') || [];
      const movie = movies.find(m => m.movie_id === ratingData.movie_id);
      const newRating = {
        rating_id: nextId,
        ...ratingData,
        user_id: ratingData.user_id || user.id,
        rating_date: ratingData.rating_date || new Date().toISOString().split('T')[0],
        username: user.username || `User ${user.id}`,
        movie_title: movie?.title || `Movie ${ratingData.movie_id}`,
      };
      ratings.push(newRating);
      setMockData('ratings', ratings);
      setMockData('nextId', { ...getMockData('nextId'), ratings: nextId + 1 });
      return { data: newRating };
    }
    return api.post('/ratings', ratingData);
  },
  update: async (id, ratingData) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const ratings = getMockData('ratings') || [];
      const index = ratings.findIndex(r => r.rating_id === parseInt(id));
      if (index === -1) throw { response: { status: 404, data: { error: 'Rating not found' } } };
      ratings[index] = { ...ratings[index], ...ratingData };
      setMockData('ratings', ratings);
      return { data: ratings[index] };
    }
    return api.put(`/ratings/${id}`, ratingData);
  },
  delete: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const ratings = getMockData('ratings') || [];
      const filtered = ratings.filter(r => r.rating_id !== parseInt(id));
      if (filtered.length === ratings.length) {
        throw { response: { status: 404, data: { error: 'Rating not found' } } };
      }
      setMockData('ratings', filtered);
      return { data: { message: 'Rating deleted successfully' } };
    }
    return api.delete(`/ratings/${id}`);
  },
};

// ==================== WATCH HISTORY API ====================
export const watchHistoryAPI = {
  getAll: async () => {
    if (MOCK_AUTH) {
      await mockDelay();
      const history = getMockData('watchHistory') || [];
      // Map last_watch_date to watch_date for frontend compatibility
      return { data: history.map(h => ({ ...h, watch_date: h.watch_date || h.last_watch_date })) };
    }
    return api.get('/watch-history');
  },
  getById: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const history = getMockData('watchHistory') || [];
      const entry = history.find(h => h.history_id === parseInt(id));
      if (!entry) throw { response: { status: 404, data: { error: 'Watch history entry not found' } } };
      return { data: entry };
    }
    return api.get(`/watch-history/${id}`);
  },
  getByUser: async (userId) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const history = getMockData('watchHistory') || [];
      const userHistory = history.filter(h => h.user_id === parseInt(userId));
      // Map last_watch_date to watch_date for frontend compatibility
      return { data: userHistory.map(h => ({ ...h, watch_date: h.watch_date || h.last_watch_date })) };
    }
    return api.get(`/watch-history/user/${userId}`);
  },
  create: async (historyData) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const history = getMockData('watchHistory') || [];
      const nextId = getMockData('nextId')?.watchHistory || history.length + 1;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const movies = getMockData('movies') || [];
      const movie = movies.find(m => m.movie_id === historyData.movie_id);
      const watchDate = historyData.watch_date || historyData.last_watch_date || new Date().toISOString().split('T')[0];
      const newEntry = {
        history_id: nextId,
        ...historyData,
        user_id: historyData.user_id || user.id,
        last_watch_date: watchDate,
        watch_date: watchDate,
        progress: historyData.progress || '0%',
        username: user.username || `User ${user.id}`,
        movie_title: movie?.title || `Movie ${historyData.movie_id}`,
      };
      history.push(newEntry);
      setMockData('watchHistory', history);
      setMockData('nextId', { ...getMockData('nextId'), watchHistory: nextId + 1 });
      return { data: newEntry };
    }
    return api.post('/watch-history', historyData);
  },
  update: async (id, historyData) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const history = getMockData('watchHistory') || [];
      const index = history.findIndex(h => h.history_id === parseInt(id));
      if (index === -1) throw { response: { status: 404, data: { error: 'Watch history entry not found' } } };
      history[index] = { ...history[index], ...historyData };
      setMockData('watchHistory', history);
      return { data: history[index] };
    }
    return api.put(`/watch-history/${id}`, historyData);
  },
  delete: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const history = getMockData('watchHistory') || [];
      const filtered = history.filter(h => h.history_id !== parseInt(id));
      if (filtered.length === history.length) {
        throw { response: { status: 404, data: { error: 'Watch history entry not found' } } };
      }
      setMockData('watchHistory', filtered);
      return { data: { message: 'Watch history entry deleted successfully' } };
    }
    return api.delete(`/watch-history/${id}`);
  },
};

// ==================== RECOMMENDATIONS API ====================
export const recommendationsAPI = {
  getAll: async () => {
    if (MOCK_AUTH) {
      await mockDelay();
      const recommendations = getMockData('recommendations') || [];
      return { data: recommendations };
    }
    return api.get('/recommendations');
  },
  getById: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const recommendations = getMockData('recommendations') || [];
      const rec = recommendations.find(r => r.rec_id === parseInt(id));
      if (!rec) throw { response: { status: 404, data: { error: 'Recommendation not found' } } };
      return { data: rec };
    }
    return api.get(`/recommendations/${id}`);
  },
  getByUser: async (userId) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const recommendations = getMockData('recommendations') || [];
      const userRecs = recommendations.filter(r => r.user_id === parseInt(userId));
      return { data: userRecs };
    }
    return api.get(`/recommendations/user/${userId}`);
  },
  create: async (recData) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const recommendations = getMockData('recommendations') || [];
      const nextId = getMockData('nextId')?.recommendations || recommendations.length + 1;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const movies = getMockData('movies') || [];
      const movie = movies.find(m => m.movie_id === recData.movie_id);
      const newRec = {
        rec_id: nextId,
        ...recData,
        user_id: recData.user_id || user.id,
        username: user.username || `User ${user.id}`,
        movie_title: movie?.title || `Movie ${recData.movie_id}`,
      };
      recommendations.push(newRec);
      setMockData('recommendations', recommendations);
      setMockData('nextId', { ...getMockData('nextId'), recommendations: nextId + 1 });
      return { data: newRec };
    }
    return api.post('/recommendations', recData);
  },
  delete: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const recommendations = getMockData('recommendations') || [];
      const filtered = recommendations.filter(r => r.rec_id !== parseInt(id));
      if (filtered.length === recommendations.length) {
        throw { response: { status: 404, data: { error: 'Recommendation not found' } } };
      }
      setMockData('recommendations', filtered);
      return { data: { message: 'Recommendation deleted successfully' } };
    }
    return api.delete(`/recommendations/${id}`);
  },
  generate: async (userId) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const recommendations = getMockData('recommendations') || [];
      const movies = getMockData('movies') || [];
      const watchHistory = getMockData('watchHistory') || [];
      const ratings = getMockData('ratings') || [];
      
      // Get user's watched movies
      const watchedMovieIds = watchHistory
        .filter(wh => wh.user_id === parseInt(userId))
        .map(wh => wh.movie_id);
      
      // Get user's rated movies
      const ratedMovieIds = ratings
        .filter(r => r.user_id === parseInt(userId))
        .map(r => r.movie_id);
      
      // Find unwatched movies that match user's preferred genres
      const userRatings = ratings.filter(r => r.user_id === parseInt(userId));
      const preferredGenres = {};
      userRatings.forEach(r => {
        const movie = movies.find(m => m.movie_id === r.movie_id);
        if (movie && movie.genre) {
          preferredGenres[movie.genre] = (preferredGenres[movie.genre] || 0) + parseFloat(r.rating_value);
        }
      });
      
      // Generate recommendations for unwatched movies
      const newRecs = [];
      const existingRecIds = new Set(
        recommendations
          .filter(r => r.user_id === parseInt(userId))
          .map(r => r.movie_id)
      );
      
      movies.forEach(movie => {
        // Skip if already watched (if excludeWatched is true, this will be filtered later)
        // Skip if already recommended
        if (existingRecIds.has(movie.movie_id)) {
          return;
        }
        
        // Generate recommendation if:
        // 1. Matches preferred genre (if user has ratings)
        // 2. Has high rating (>= 3.5)
        // 3. Or if user has no preferences, recommend all unwatched movies
        const hasPreferredGenre = Object.keys(preferredGenres).length > 0 && preferredGenres[movie.genre];
        const hasHighRating = parseFloat(movie.average_rating || 0) >= 3.5;
        const noPreferences = Object.keys(preferredGenres).length === 0;
        
        if (hasPreferredGenre || hasHighRating || noPreferences) {
          const nextId = (getMockData('nextId')?.recommendations || recommendations.length + 1) + newRecs.length;
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          
          let reason = '';
          if (hasPreferredGenre) {
            reason = `Based on your interest in ${movie.genre} movies`;
          } else if (hasHighRating) {
            reason = `Highly rated ${movie.genre} movie (${parseFloat(movie.average_rating).toFixed(1)}/5.0)`;
          } else {
            reason = `Popular ${movie.genre} movie you might enjoy`;
          }
          
          newRecs.push({
            rec_id: nextId,
            user_id: parseInt(userId),
            movie_id: movie.movie_id,
            reason: reason,
            username: user.username || `User ${userId}`,
            movie_title: movie.title,
          });
        }
      });
      
      recommendations.push(...newRecs);
      setMockData('recommendations', recommendations);
      if (newRecs.length > 0) {
        setMockData('nextId', { ...getMockData('nextId'), recommendations: newRecs[newRecs.length - 1].rec_id + 1 });
      }
      
      return { data: { message: `Generated ${newRecs.length} recommendations`, recommendations: newRecs } };
    }
    return api.post(`/recommendations/generate/${userId}`);
  },
};

// ==================== REPORTS API ====================
export const reportsAPI = {
  getPopularMovies: () => api.get('/reports/popular-movies'),
  getGenreStatistics: () => api.get('/reports/genre-statistics'),
  getUserActivity: () => api.get('/reports/user-activity'),
  getOverdueRecommendations: () => api.get('/reports/overdue-recommendations'),
  getAggregates: () => api.get('/reports/aggregates'),
  getAboveAverageMovies: () => api.get('/reports/above-average-movies'),
};

// ==================== USERS API ====================
export const usersAPI = {
  getAll: async () => {
    if (MOCK_AUTH) {
      await mockDelay();
      // Return users from MOCK_USERS but in the format expected by the frontend
      const users = Object.values(MOCK_USERS).map(mu => ({
        user_id: mu.user.id,
        username: mu.user.username,
        email: mu.user.email,
        role: mu.user.role,
        join_date: '2023-01-15', // Default join date
      }));
      return { data: users };
    }
    return api.get('/users');
  },
  getById: async (id) => {
    if (MOCK_AUTH) {
      await mockDelay();
      const user = Object.values(MOCK_USERS).find(mu => mu.user.id === parseInt(id));
      if (!user) throw { response: { status: 404, data: { error: 'User not found' } } };
      return { 
        data: {
          user_id: user.user.id,
          username: user.user.username,
          email: user.user.email,
          role: user.user.role,
          join_date: '2023-01-15',
        }
      };
    }
    return api.get(`/users/${id}`);
  },
};

// ==================== GENRES API ====================
export const genresAPI = {
  getAll: async () => {
    if (MOCK_AUTH) {
      await mockDelay();
      const genres = getMockData('genres') || [];
      return { data: genres };
    }
    return api.get('/genres');
  },
};

// ==================== VIEWS API ====================
export const viewsAPI = {
  getAll: () => api.get('/views'),
  create: (viewName, query) => api.post('/views', { name: viewName, query }),
  query: (viewName) => api.get(`/views/${viewName}`),
  delete: (viewName) => api.delete(`/views/${viewName}`),
};

// ==================== SNAPSHOTS API ====================
export const snapshotsAPI = {
  getAll: () => api.get('/snapshots'),
  create: (snapshotName) => api.post('/snapshots', { name: snapshotName }),
  getById: (id) => api.get(`/snapshots/${id}`),
  delete: (id) => api.delete(`/snapshots/${id}`),
};

// ==================== QUERIES API ====================
export const queriesAPI = {
  execute: (query) => api.post('/queries/execute', { query }),
};

export default api;


