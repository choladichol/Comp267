import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationsAPI, usersAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { canDelete, canCreate, canDeleteItem } from '../../../utils/rolePermissions';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import './RecommendationsList.css';

function RecommendationsList() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      let response;
      if (user?.role === 'end_user') {
        response = await recommendationsAPI.getByUser(user.id);
      } else {
        response = await recommendationsAPI.getAll();
      }
      setRecommendations(response.data || []);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recommendation?')) {
      return;
    }

    try {
      await recommendationsAPI.delete(id);
      setRecommendations(recommendations.filter(r => r.rec_id !== id));
      alert('Recommendation deleted successfully');
    } catch (err) {
      alert('Failed to delete recommendation');
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!user?.id) return;
    
    if (!window.confirm('Generate personalized recommendations based on your viewing history?')) {
      return;
    }

    try {
      await recommendationsAPI.generate(user.id);
      alert('Recommendations generated successfully!');
      loadRecommendations();
    } catch (err) {
      alert('Failed to generate recommendations');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading recommendations...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Recommendations</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user?.role === 'end_user' && (
            <button onClick={handleGenerate} className="btn-primary">
              Generate Recommendations
            </button>
          )}
          {canCreate(user?.role) && (
            <Link to="/recommendations/new" className="btn-primary">
              <FiPlus /> Add New Recommendation
            </Link>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="recommendations-grid">
        {recommendations.length === 0 ? (
          <div className="no-data">No recommendations found</div>
        ) : (
          recommendations.map(rec => (
            <div key={rec.rec_id} className="recommendation-card">
              <h3>{rec.movie_title || `Movie ${rec.movie_id}`}</h3>
              <p className="recommendation-reason">{rec.reason || 'No reason provided'}</p>
              <div className="recommendation-meta">
                <span>For: {rec.username || `User ${rec.user_id}`}</span>
                {canDeleteItem(user?.role, rec.user_id, user?.id) && (
                  <button
                    onClick={() => handleDelete(rec.rec_id)}
                    className="btn-icon btn-danger"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecommendationsList;

