import React, { useState, useEffect } from 'react';
import { snapshotsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { canManageSnapshots } from '../../utils/rolePermissions';
import './Advanced.css';

function SnapshotsManager() {
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snapshotName, setSnapshotName] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [snapshotData, setSnapshotData] = useState([]);

  useEffect(() => {
    loadSnapshots();
  }, []);

  const loadSnapshots = async () => {
    try {
      const response = await snapshotsAPI.getAll();
      setSnapshots(response.data || []);
    } catch (err) {
      setError('Failed to load snapshots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async (e) => {
    e.preventDefault();
    if (!snapshotName) {
      alert('Please provide a snapshot name');
      return;
    }

    try {
      await snapshotsAPI.create(snapshotName);
      alert('Snapshot created successfully');
      setSnapshotName('');
      loadSnapshots();
    } catch (err) {
      alert('Failed to create snapshot: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleViewSnapshot = async (id) => {
    try {
      const response = await snapshotsAPI.getById(id);
      setSnapshotData(response.data || []);
      setSelectedSnapshot(id);
    } catch (err) {
      alert('Failed to load snapshot data: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleDeleteSnapshot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this snapshot?')) {
      return;
    }

    try {
      await snapshotsAPI.delete(id);
      alert('Snapshot deleted successfully');
      loadSnapshots();
      if (selectedSnapshot === id) {
        setSelectedSnapshot(null);
        setSnapshotData([]);
      }
    } catch (err) {
      alert('Failed to delete snapshot');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading snapshots...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Snapshots Manager</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {canManageSnapshots(user?.role) && (
        <div className="form-container">
          <h2>Create New Snapshot</h2>
          <form onSubmit={handleCreateSnapshot}>
            <div className="form-group">
              <label>Snapshot Name *</label>
              <input
                type="text"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="e.g., monthly_popularity_2024_11"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Create Snapshot</button>
            </div>
          </form>
        </div>
      )}

      <div className="snapshots-list">
        <h2>Existing Snapshots</h2>
        {snapshots.length === 0 ? (
          <p className="no-data">No snapshots found</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((snapshot) => (
                  <tr key={snapshot.snapshot_id || snapshot.id}>
                    <td>{snapshot.snapshot_id || snapshot.id}</td>
                    <td>{snapshot.name || snapshot.snapshot_name || 'Unnamed'}</td>
                    <td>{snapshot.created_date || snapshot.snapshot_date || 'N/A'}</td>
                    <td className="actions">
                      <button
                        onClick={() => handleViewSnapshot(snapshot.snapshot_id || snapshot.id)}
                        className="btn-primary"
                      >
                        View Data
                      </button>
                      {canManageSnapshots(user?.role) && (
                        <button
                          onClick={() => handleDeleteSnapshot(snapshot.snapshot_id || snapshot.id)}
                          className="btn-danger"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedSnapshot && snapshotData.length > 0 && (
        <div className="snapshot-results">
          <h2>Snapshot Data</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(snapshotData[0]).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {snapshotData.map((row, index) => (
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

export default SnapshotsManager;


