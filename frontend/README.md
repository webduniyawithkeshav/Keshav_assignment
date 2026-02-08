# Agent Management Frontend

React frontend for the Agent Management System with admin authentication, agent management, CSV upload, and distribution visualization.

## Features

- ✅ Admin Login with JWT authentication
- ✅ Dashboard with statistics
- ✅ Add Agent with validation
- ✅ CSV/XLSX/XLS file upload
- ✅ Agent-wise distribution view
- ✅ Protected routes
- ✅ Clean, responsive UI

## Tech Stack

- React 19
- React Router v6
- Axios
- Vite

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Update `.env` if backend URL is different:
     ```
     VITE_API_BASE_URL=http://localhost:5000/api
     ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── auth/         # Authentication components
│   └── layout/       # Layout & Navbar
├── pages/            # All page components
├── context/          # AuthContext
├── services/         # API services
└── App.jsx           # Main app with routing
```

## Pages

1. **Login Page** (`/login`) - Admin authentication
2. **Dashboard** (`/dashboard`) - Stats and quick actions
3. **Add Agent** (`/agents`) - Agent creation form
4. **Upload CSV** (`/upload`) - File upload and distribution
5. **Distribution** (`/distribution`) - View records by agent

## Authentication

- JWT tokens stored in localStorage
- Axios interceptors add token to requests
- Auto-redirect on 401 errors
- Protected routes require authentication

## API Integration

All API calls go through services in `src/services/`:
- `authService.js` - Login, logout, token verification
- `agentService.js` - Agent CRUD operations
- `recordService.js` - File upload, records, stats

## Default Credentials

**After backend setup**, register an admin:
```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

Then login with:
- Email: `admin@example.com`
- Password: `password123`

## Development

```bash
npm run dev          # Start dev server (default: http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

---

**Ready to use!** Make sure backend is running on `http://localhost:5000`
