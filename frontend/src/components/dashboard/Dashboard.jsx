import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reportsAPI, watchHistoryAPI, ratingsAPI } from '../../services/api';
import { FiFilm, FiStar, FiClock, FiTrendingUp, FiUsers, FiBarChart2 } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    moviesWatched: 0,
    ratingsGiven: 0,
    averageRating: 0,
    totalMovies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load aggregates
      const aggregatesRes = await reportsAPI.getAggregates();
      const aggregates = aggregatesRes.data;

      // Load user-specific data
      if (user) {
        const watchHistoryRes = await watchHistoryAPI.getByUser(user.id);
        const ratingsRes = await ratingsAPI.getByUser(user.id);
        
        const watched = watchHistoryRes.data || [];
        const ratings = ratingsRes.data || [];
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + parseFloat(r.rating_value), 0) / ratings.length
          : 0;

        setStats({
          moviesWatched: watched.length,
          ratingsGiven: ratings.length,
          averageRating: avgRating.toFixed(2),
          totalMovies: aggregates.total_movies || 0,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Set default values if API fails
      setStats({
        moviesWatched: 0,
        ratingsGiven: 0,
        averageRating: 0,
        totalMovies: 0,
      });
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <p>Role: <strong>{user?.role}</strong></p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <FiFilm className="stat-icon" />
            <div>
              <h3>{stats.moviesWatched}</h3>
              <p>Movies Watched</p>
            </div>
          </div>
          <div className="stat-card">
            <FiStar className="stat-icon" />
            <div>
              <h3>{stats.ratingsGiven}</h3>
              <p>Ratings Given</p>
            </div>
          </div>
          <div className="stat-card">
            <FiTrendingUp className="stat-icon" />
            <div>
              <h3>{stats.averageRating}</h3>
              <p>Avg Rating Given</p>
            </div>
          </div>
          <div className="stat-card">
            <FiFilm className="stat-icon" />
            <div>
              <h3>{stats.totalMovies}</h3>
              <p>Total Movies</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="dashboard-menu">
          <h3>Navigation</h3>
          <div className="menu-grid">
            {/* CRUD Operations */}
            <Link to="/movies" className="menu-card">
              <FiFilm />
              <span>Movies</span>
            </Link>
            <Link to="/ratings" className="menu-card">
              <FiStar />
              <span>Ratings</span>
            </Link>
            <Link to="/watch-history" className="menu-card">
              <FiClock />
              <span>Watch History</span>
            </Link>
            <Link to="/recommendations" className="menu-card">
              <FiTrendingUp />
              <span>Recommendations</span>
            </Link>

            {/* Reports */}
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <>
                <Link to="/reports" className="menu-card">
                  <FiBarChart2 />
                  <span>Reports</span>
                </Link>
              </>
            )}

            {/* Special Functionality */}
            <Link to="/advanced-recommendations" className="menu-card special-feature">
              <FiTrendingUp />
              <span>Advanced Recommendations</span>
            </Link>

            {/* Advanced Features */}
            {user?.role === 'admin' && (
              <>
                <Link to="/views" className="menu-card">
                  <FiBarChart2 />
                  <span>Database Views</span>
                </Link>
                <Link to="/snapshots" className="menu-card">
                  <FiClock />
                  <span>Snapshots</span>
                </Link>
                <Link to="/query-executor" className="menu-card">
                  <FiBarChart2 />
                  <span>Query Executor</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


