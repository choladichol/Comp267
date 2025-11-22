import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiTrendingUp, FiUsers, FiClock, FiFilm } from 'react-icons/fi';
import PopularMoviesReport from './PopularMoviesReport';
import GenreStatisticsReport from './GenreStatisticsReport';
import UserActivityReport from './UserActivityReport';
import OverdueRecommendationsReport from './OverdueRecommendationsReport';
import './ReportsPage.css';

function ReportsPage() {
  const [activeReport, setActiveReport] = useState('popular');

  const reports = [
    { id: 'popular', name: 'Popular Movies', icon: <FiTrendingUp /> },
    { id: 'genre', name: 'Genre Statistics', icon: <FiBarChart2 /> },
    { id: 'activity', name: 'User Activity', icon: <FiUsers /> },
    { id: 'overdue', name: 'Overdue Recommendations', icon: <FiClock /> },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reports</h1>
      </div>

      <div className="reports-layout">
        <div className="reports-sidebar">
          <h3>Available Reports</h3>
          <ul className="reports-menu">
            {reports.map(report => (
              <li key={report.id}>
                <button
                  className={activeReport === report.id ? 'active' : ''}
                  onClick={() => setActiveReport(report.id)}
                >
                  {report.icon}
                  <span>{report.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="reports-content">
          {activeReport === 'popular' && <PopularMoviesReport />}
          {activeReport === 'genre' && <GenreStatisticsReport />}
          {activeReport === 'activity' && <UserActivityReport />}
          {activeReport === 'overdue' && <OverdueRecommendationsReport />}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;


