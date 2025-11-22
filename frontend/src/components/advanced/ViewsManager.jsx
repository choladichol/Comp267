import React, { useState, useEffect } from 'react';
import { viewsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { canManageViews } from '../../utils/rolePermissions';
import './Advanced.css';

function ViewsManager() {
  const { user } = useAuth();
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewName, setViewName] = useState('');
  const [viewQuery, setViewQuery] = useState('');
  const [selectedView, setSelectedView] = useState(null);
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    loadViews();
  }, []);

  const loadViews = async () => {
    try {
      const response = await viewsAPI.getAll();
      setViews(response.data || []);
    } catch (err) {
      setError('Failed to load views');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateView = async (e) => {
    e.preventDefault();
    if (!viewName || !viewQuery) {
      alert('Please provide both view name and SQL query');
      return;
    }

    try {
      await viewsAPI.create(viewName, viewQuery);
      alert('View created successfully');
      setShowCreateForm(false);
      setViewName('');
      setViewQuery('');
      loadViews();
    } catch (err) {
      alert('Failed to create view: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleQueryView = async (viewName) => {
    try {
      const response = await viewsAPI.query(viewName);
      setViewData(response.data || []);
      setSelectedView(viewName);
    } catch (err) {
      alert('Failed to query view: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleDeleteView = async (viewName) => {
    if (!window.confirm(`Are you sure you want to delete view "${viewName}"?`)) {
      return;
    }

    try {
      await viewsAPI.delete(viewName);
      alert('View deleted successfully');
      loadViews();
      if (selectedView === viewName) {
        setSelectedView(null);
        setViewData([]);
      }
    } catch (err) {
      alert('Failed to delete view');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading views...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Database Views Manager</h1>
        {canManageViews(user?.role) && (
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            {showCreateForm ? 'Cancel' : 'Create New View'}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && canManageViews(user?.role) && (
        <div className="form-container">
          <h2>Create New View</h2>
          <form onSubmit={handleCreateView}>
            <div className="form-group">
              <label>View Name *</label>
              <input
                type="text"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                placeholder="e.g., popular_movies"
                required
              />
            </div>
            <div className="form-group">
              <label>SQL Query *</label>
              <textarea
                value={viewQuery}
                onChange={(e) => setViewQuery(e.target.value)}
                placeholder="SELECT * FROM movies WHERE average_rating > 4.0"
                rows="5"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Create View</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="views-list">
        <h2>Existing Views</h2>
        {views.length === 0 ? (
          <p className="no-data">No views found</p>
        ) : (
          <div className="views-grid">
            {views.map((view, index) => (
              <div key={view.name || index} className="view-card">
                <h3>{view.name || 'Unnamed View'}</h3>
                <div className="view-actions">
                  <button onClick={() => handleQueryView(view.name)} className="btn-primary">
                    Query View
                  </button>
                  {canManageViews(user?.role) && (
                    <button
                      onClick={() => handleDeleteView(view.name)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedView && viewData.length > 0 && (
        <div className="view-results">
          <h2>Results from: {selectedView}</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(viewData[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {viewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewsManager;


