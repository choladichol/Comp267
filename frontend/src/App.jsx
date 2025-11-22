import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import NavigationBar from './components/common/NavigationBar';

// Auth
import Login from './components/auth/Login';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// CRUD - Movies
import MovieList from './components/crud/Movies/MovieList';
import MovieForm from './components/crud/Movies/MovieForm';

// CRUD - Ratings
import RatingList from './components/crud/Ratings/RatingList';
import RatingForm from './components/crud/Ratings/RatingForm';

// CRUD - Watch History
import WatchHistoryList from './components/crud/WatchHistory/WatchHistoryList';
import WatchHistoryForm from './components/crud/WatchHistory/WatchHistoryForm';

// CRUD - Recommendations
import RecommendationsList from './components/crud/Recommendations/RecommendationsList';

// Reports
import ReportsPage from './components/reports/ReportsPage';

// Advanced Features
import ViewsManager from './components/advanced/ViewsManager';
import SnapshotsManager from './components/advanced/SnapshotsManager';
import QueryExecutor from './components/advanced/QueryExecutor';

// Special Functionality
import AdvancedRecommendationEngine from './components/special/AdvancedRecommendationEngine';

import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false, requireManager = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireManager && !['manager', 'admin'].includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <>
      <NavigationBar />
      <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Movies Routes */}
      <Route
        path="/movies"
        element={
          <ProtectedRoute>
            <MovieList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/movies/new"
        element={
          <ProtectedRoute requireManager>
            <MovieForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/movies/:id/edit"
        element={
          <ProtectedRoute requireManager>
            <MovieForm />
          </ProtectedRoute>
        }
      />

      {/* Ratings Routes */}
      <Route
        path="/ratings"
        element={
          <ProtectedRoute>
            <RatingList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ratings/new"
        element={
          <ProtectedRoute>
            <RatingForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ratings/:id/edit"
        element={
          <ProtectedRoute>
            <RatingForm />
          </ProtectedRoute>
        }
      />

      {/* Watch History Routes */}
      <Route
        path="/watch-history"
        element={
          <ProtectedRoute>
            <WatchHistoryList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/watch-history/new"
        element={
          <ProtectedRoute>
            <WatchHistoryForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/watch-history/:id/edit"
        element={
          <ProtectedRoute>
            <WatchHistoryForm />
          </ProtectedRoute>
        }
      />

      {/* Recommendations Routes */}
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <RecommendationsList />
          </ProtectedRoute>
        }
      />

      {/* Reports Routes */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute requireManager>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Advanced Features - Admin Only */}
      <Route
        path="/views"
        element={
          <ProtectedRoute requireAdmin>
            <ViewsManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/snapshots"
        element={
          <ProtectedRoute requireAdmin>
            <SnapshotsManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/query-executor"
        element={
          <ProtectedRoute requireAdmin>
            <QueryExecutor />
          </ProtectedRoute>
        }
      />

      {/* Special Functionality - Available to all authenticated users */}
      <Route
        path="/advanced-recommendations"
        element={
          <ProtectedRoute>
            <AdvancedRecommendationEngine />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;


