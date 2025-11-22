import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './NavigationBar.css';

function NavigationBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/dashboard" className="navbar-brand">
            <FiHome className="brand-icon" />
            <span>Movie Recommendations</span>
          </Link>
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-right ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-links">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiHome /> Dashboard
            </Link>
            <Link 
              to="/movies" 
              className={`nav-link ${isActive('/movies') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              to="/ratings" 
              className={`nav-link ${isActive('/ratings') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Ratings
            </Link>
            <Link 
              to="/watch-history" 
              className={`nav-link ${isActive('/watch-history') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Watch History
            </Link>
            <Link 
              to="/recommendations" 
              className={`nav-link ${isActive('/recommendations') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Recommendations
            </Link>
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <Link 
                to="/reports" 
                className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Reports
              </Link>
            )}
            <Link 
              to="/advanced-recommendations" 
              className={`nav-link ${isActive('/advanced-recommendations') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Advanced Recs
            </Link>
            {user?.role === 'admin' && (
              <>
                <Link 
                  to="/views" 
                  className={`nav-link ${isActive('/views') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Views
                </Link>
                <Link 
                  to="/snapshots" 
                  className={`nav-link ${isActive('/snapshots') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Snapshots
                </Link>
                <Link 
                  to="/query-executor" 
                  className={`nav-link ${isActive('/query-executor') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Query Executor
                </Link>
              </>
            )}
          </div>

          <div className="navbar-user">
            <span className="user-info">
              {user?.username} ({user?.role})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;

