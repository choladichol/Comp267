# Movie Recommendations System - Frontend

This is the frontend application for the COMP 267 Database Design Team Project - Phase 2.

## Features

### ✅ Required Features (Per Rubric)

- ✅ User Login / User Logout Functionalities
- ✅ Dashboard
- ✅ Create Operations (Movies, Ratings, Watch History, Recommendations)
- ✅ Read Operations (Display all data)
- ✅ Update Operations (Edit existing records)
- ✅ Delete Operations (Remove records)
- ✅ Report Generation
  - Currently Available Movies
  - Overdue Recommendations
  - Popular Movies (Frequently Used)
  - Genre Statistics
  - User Activity Report
- ✅ Aggregate Functions (Display COUNT, AVG, SUM, etc.)
- ✅ Execute Queries & Subqueries (Query Executor)
- ✅ Create Views (Database Views Manager)
- ✅ Create Snapshots (Snapshots Manager)
- ✅ Special Functionality (Personalized Recommendation Engine)

## Technology Stack

- **React 18.2.0** - Frontend framework
- **React Router 6.20.0** - Routing
- **Axios 1.6.2** - HTTP client
- **React Icons 4.12.0** - Icons

## Setup Instructions

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment:
   - Copy `.env.example` to `.env`
   - Update `REACT_APP_API_URL` with your backend API URL
   - Set `REACT_APP_MOCK_AUTH=true` to enable mock authentication for testing

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Login Credentials

### Option 1: Mock Authentication (Development/Testing)

If `REACT_APP_MOCK_AUTH=true` in your `.env` file, you can login with:

**End User:**
- Email: `john@email.com`
- Password: `password123`
- Role: `end_user`

**Manager:**
- Email: `jane@email.com`
- Password: `password123`
- Role: `manager`

**Admin:**
- Email: `mike@email.com`
- Password: `password123`
- Role: `admin`

### Option 2: Real Backend Authentication

Once your backend API is running:
1. Set `REACT_APP_MOCK_AUTH=false` in `.env`
2. Update `REACT_APP_API_URL` to match your backend API
3. Login with credentials provided by your backend team

## User Roles

- **End User** (`end_user`): Can view and manage their own data (ratings, watch history)
- **Manager** (`manager`): Can view/edit movies, ratings, and access reports
- **Admin** (`admin`): Full access including Views, Snapshots, and Query Executor

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/          # Login component
│   │   ├── dashboard/     # Dashboard
│   │   ├── crud/          # CRUD operations
│   │   │   ├── Movies/
│   │   │   ├── Ratings/
│   │   │   ├── WatchHistory/
│   │   │   └── Recommendations/
│   │   ├── reports/       # Report components
│   │   └── advanced/      # Views, Snapshots, Query Executor
│   ├── services/
│   │   └── api.js         # API service layer
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   ├── utils/
│   │   └── rolePermissions.js # Role-based permissions
│   ├── App.jsx            # Main app with routing
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
└── package.json
```

## API Integration

The frontend expects the backend API to be running and accessible. All API calls are centralized in `src/services/api.js`.

### Expected Backend Endpoints:

- `/api/auth/login` - POST
- `/api/auth/logout` - POST
- `/api/movies` - GET, POST
- `/api/movies/:id` - GET, PUT, DELETE
- `/api/ratings` - GET, POST
- `/api/ratings/:id` - GET, PUT, DELETE
- `/api/watch-history` - GET, POST
- `/api/watch-history/:id` - GET, PUT, DELETE
- `/api/recommendations` - GET, POST
- `/api/recommendations/:id` - DELETE
- `/api/recommendations/generate/:userId` - POST
- `/api/reports/*` - GET (various report endpoints)
- `/api/views` - GET, POST, DELETE
- `/api/views/:name` - GET
- `/api/snapshots` - GET, POST
- `/api/snapshots/:id` - GET, DELETE
- `/api/queries/execute` - POST

## Development

To build for production:
```bash
npm run build
```

The build folder will contain the production-ready files.

## Testing Without Backend

To test the frontend without a backend API:

1. Create `.env` file in the `frontend` directory:
```
REACT_APP_MOCK_AUTH=true
```

2. Login with any of the mock credentials listed above

3. Note: Mock authentication only simulates login - actual data operations will still need the backend API
