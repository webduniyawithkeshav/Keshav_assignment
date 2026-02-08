# Agent Management System - MERN Stack

A complete **Admin-Agent Management System** with CSV/Excel upload and automatic record distribution. Built with MongoDB, Express, React, and Node.js.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Demo Flow](#demo-flow)
- [Notes for Evaluator](#notes-for-evaluator)

---

## 🎯 Overview

This application allows **administrators** to:
- Authenticate securely using JWT
- Manage agents (create, view, update, delete)
- Upload CSV/XLSX/XLS files with customer data
- Automatically distribute records equally among **exactly 5 active agents**
- View agent-wise distribution with filters and pagination

The system ensures **equal distribution** with remainder handling (e.g., 26 records → 6, 5, 5, 5, 5).

---

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload middleware
- **csv-parser** - CSV parsing
- **xlsx** - Excel file parsing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

---

## ✨ Features

### Authentication & Security
- ✅ Admin registration and login
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Protected routes on frontend and backend
- ✅ Automatic token refresh handling

### Agent Management
- ✅ Create agents with name, email, phone
- ✅ Email uniqueness validation
- ✅ Phone number validation (10-15 digits)
- ✅ View all agents with pagination
- ✅ Track assigned records count

### CSV/Excel Upload
- ✅ Support for CSV, XLSX, XLS formats
- ✅ File validation (type, size, columns)
- ✅ Required columns: FirstName, Phone, Notes
- ✅ Row-by-row data validation
- ✅ Maximum file size: 10MB

### Distribution Logic
- ✅ Requires exactly 5 active agents
- ✅ Equal distribution algorithm
- ✅ Remainder distributed sequentially
- ✅ Example: 26 records → 6, 5, 5, 5, 5
- ✅ MongoDB transactions for data consistency
- ✅ Unique batch IDs for tracking

### Frontend UI
- ✅ Responsive dashboard with statistics
- ✅ Agent creation form with validation
- ✅ File upload interface with progress
- ✅ Distribution view with filters
- ✅ Pagination for large datasets
- ✅ Clean, professional design

---

## 📁 Project Structure

```
Assignmentcsinfo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   ├── jwt.js             # JWT utilities
│   │   │   └── upload.js          # Multer configuration
│   │   ├── models/
│   │   │   ├── Admin.js           # Admin schema
│   │   │   ├── Agent.js           # Agent schema
│   │   │   └── Record.js          # Record schema
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   ├── agentController.js # Agent CRUD
│   │   │   └── recordController.js# Upload & distribution
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verification
│   │   │   ├── errorHandler.js    # Error handling
│   │   │   └── validator.js       # Input validation
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Auth endpoints
│   │   │   ├── agentRoutes.js     # Agent endpoints
│   │   │   └── recordRoutes.js    # Record endpoints
│   │   ├── utils/
│   │   │   ├── csvParser.js       # CSV/Excel parsing
│   │   │   └── distributor.js     # Distribution algorithm
│   │   ├── app.js                 # Express app
│   │   └── server.js              # Server entry point
│   ├── uploads/                   # Temporary file storage
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   │   ├── LoginForm.jsx
    │   │   │   └── ProtectedRoute.jsx
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       └── Layout.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── AddAgentPage.jsx
    │   │   ├── UploadCSVPage.jsx
    │   │   └── DistributionListPage.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── services/
    │   │   ├── api.js             # Axios instance
    │   │   ├── authService.js     # Auth API calls
    │   │   ├── agentService.js    # Agent API calls
    │   │   └── recordService.js   # Record API calls
    │   ├── App.jsx                # Router setup
    │   └── main.jsx               # Entry point
    ├── .env                       # Environment variables
    ├── package.json
    └── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB** installed and running
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # Create .env in backend/ directory
   touch .env
   ```

4. **Add environment variables** (see [Environment Variables](#environment-variables) section)

5. **Start MongoDB:**
   - **Windows:** `net start MongoDB`
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

6. **Run backend server:**
   ```bash
   npm run dev
   ```
   
   Server will start on **http://localhost:5000**

---

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # Create .env in frontend/ directory
   touch .env
   ```

4. **Add environment variables** (see [Environment Variables](#environment-variables) section)

5. **Run frontend server:**
   ```bash
   npm run dev
   ```
   
   Application will start on **http://localhost:5173**

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/agent-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

### Frontend `.env`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🎬 Running the Application

### Option 1: Development Mode (Recommended for Testing)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

### Option 2: Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 📡 API Overview

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new admin | No |
| POST | `/auth/login` | Admin login | No |
| GET | `/auth/verify` | Verify JWT token | Yes |

**Example Login Request:**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

---

### Agent Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/agents` | Get all agents | Yes |
| GET | `/agents/count` | Get active agent count | Yes |
| POST | `/agents` | Create new agent | Yes |
| GET | `/agents/:id` | Get single agent | Yes |
| PUT | `/agents/:id` | Update agent | Yes |
| DELETE | `/agents/:id` | Delete agent | Yes |

**Example Create Agent:**
```json
POST /api/agents
Authorization: Bearer <token>
{
  "name": "Agent One",
  "email": "agent1@example.com",
  "phone": "1234567890"
}
```

---

### Record Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/records/upload` | Upload CSV/Excel file | Yes |
| GET | `/records` | Get records (filtered, paginated) | Yes |
| GET | `/records/stats` | Get distribution statistics | Yes |
| PUT | `/records/:id` | Update record status | Yes |

**Example Upload:**
```bash
POST /api/records/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: sample.csv
```

**Response:**
```json
{
  "success": true,
  "data": {
    "batchId": "batch-1707310555000-abc123",
    "totalRecords": 26,
    "distribution": [
      { "agentName": "Agent One", "assignedCount": 6 },
      { "agentName": "Agent Two", "assignedCount": 5 },
      { "agentName": "Agent Three", "assignedCount": 5 },
      { "agentName": "Agent Four", "assignedCount": 5 },
      { "agentName": "Agent Five", "assignedCount": 5 }
    ]
  }
}
```

---

## 🎥 Demo Flow

### Suggested Demo Sequence

1. **Start Application**
   - Start backend and frontend servers
   - Open http://localhost:5173

2. **Admin Registration/Login**
   - Register admin (or use existing credentials)
   - Show login page
   - Login successfully
   - Show redirect to dashboard

3. **Dashboard Overview**
   - Show statistics (0 agents initially)
   - Explain quick action cards
   - Show warning: "Need 5 active agents"

4. **Create Agents**
   - Navigate to "Add Agent"
   - Create 5 agents one by one:
     - Agent 1: agent1@example.com, 1234567890
     - Agent 2: agent2@example.com, 2345678901
     - Agent 3: agent3@example.com, 3456789012
     - Agent 4: agent4@example.com, 4567890123
     - Agent 5: agent5@example.com, 5678901234
   - Show validation (duplicate email, invalid phone)
   - Return to dashboard, show agent count updated

5. **Upload CSV File**
   - Navigate to "Upload CSV"
   - Show agent count badge (5/5 - green)
   - Select sample CSV file (26 records)
   - Click "Upload & Distribute"
   - Show distribution results:
     - Agent 1: 6 records
     - Agent 2-5: 5 records each

6. **View Distribution**
   - Navigate to "Distribution"
   - Show records table
   - Demonstrate filters:
     - Filter by specific agent
     - Filter by status
   - Show pagination (if >20 records)
   - Show record details (FirstName, Phone, Notes, Assigned Agent)

7. **Logout**
   - Click logout button
   - Show redirect to login page

---

## 📝 Notes for Evaluator

### Key Implementation Highlights

1. **Distribution Algorithm (PROMPT 6)**
   - Implemented in `backend/src/utils/distributor.js`
   - Uses `Math.floor(total/5)` for base distribution
   - Remainder distributed to first N agents
   - Example: 26 records → 6, 5, 5, 5, 5 ✅
   - MongoDB transactions ensure data consistency

2. **Security Best Practices**
   - Passwords hashed with bcrypt (12 rounds)
   - JWT tokens with 7-day expiration
   - Protected routes on both frontend and backend
   - Input validation on all endpoints
   - CORS configured for frontend URL

3. **File Upload Validation**
   - File type: CSV, XLSX, XLS only
   - File size: 10MB maximum
   - Required columns: FirstName, Phone, Notes
   - Phone validation: 10-15 digits
   - Row-by-row error reporting

4. **Error Handling**
   - Global error handler middleware
   - Descriptive error messages
   - HTTP status codes (400, 401, 404, 500)
   - Frontend displays all API errors
   - Transaction rollback on failures

5. **Frontend Architecture**
   - AuthContext for global state
   - Axios interceptors for JWT
   - Protected routes with auto-redirect
   - Loading states on all async operations
   - Responsive design

### Edge Cases Handled

- ✅ Less than 5 agents: Clear error with count needed
- ✅ Less than 5 records: Correct distribution (some agents get 0)
- ✅ Empty CSV file: Validation error before upload
- ✅ Missing columns: Specific error for each column
- ✅ Invalid data: Row-by-row error messages
- ✅ Duplicate email: Agent creation prevented
- ✅ Token expiry: Auto-logout and redirect
- ✅ Large files: 10MB size limit enforced

### Testing Recommendations

1. **Test Distribution Algorithm:**
   - Upload 26 records → Verify 6, 5, 5, 5, 5
   - Upload 3 records → Verify 1, 1, 1, 0, 0
   - Upload 100 records → Verify 20, 20, 20, 20, 20

2. **Test Validations:**
   - Try uploading with 3 agents (should fail)
   - Try uploading .txt file (should fail)
   - Try creating agent with duplicate email (should fail)
   - Try invalid phone numbers (should fail)

3. **Test Authentication:**
   - Access protected routes without login (should redirect)
   - Login with wrong credentials (should show error)
   - Logout and access protected routes (should redirect)

### Sample CSV File

Create `sample.csv` for testing:

```csv
FirstName,Phone,Notes
John Doe,1234567890,First customer
Jane Smith,9876543210,VIP client
Bob Johnson,5551234567,Regular customer
Alice Williams,5559876543,New lead
Charlie Brown,5551112222,Existing customer
David Lee,5553334444,Potential client
Emma Davis,5555556666,Follow up needed
Frank Miller,5557778888,Hot lead
Grace Taylor,5559990000,Cold call
Henry Wilson,5551231234,Referral
Ian Moore,5552223333,Referral
Julia Anderson,5554445555,New lead
Kevin Thomas,5556667777,VIP client
Laura Jackson,5558889999,Regular customer
Michael White,5550001111,Existing customer
Nancy Harris,5552224444,Potential client
Oliver Martin,5556668888,Follow up needed
Patricia Thompson,5550002222,Hot lead
Quinn Garcia,5554446666,Cold call
Rachel Martinez,5558880000,Referral
Steve Robinson,5552220000,New lead
Tina Clark,5556664444,VIP client
Uma Rodriguez,5550008888,Regular customer
Victor Lewis,5554442222,Existing customer
Wendy Lee,5558886666,Potential client
Xavier Walker,5550004444,Hot lead
```

(26 records total)

---

## 🎓 Additional Documentation

Comprehensive guides available in the project:

- **[Backend README](./backend/README.md)** - Detailed backend documentation
- **[Frontend README](./frontend/README.md)** - Detailed frontend documentation
- **[AUTH_API_GUIDE](./backend/AUTH_API_GUIDE.md)** - Authentication details
- **[DISTRIBUTION_LOGIC_GUIDE](./backend/DISTRIBUTION_LOGIC_GUIDE.md)** - Algorithm explanation

---

## 📞 Support

For issues or questions:
1. Check the comprehensive documentation in `/backend` and `/frontend`
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check console logs for detailed error messages

---

## ✅ Checklist Before Demo

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] Admin account created
- [ ] Sample CSV file prepared (26+ records)
- [ ] Browser console clear of errors
- [ ] Network tab shows successful API calls

---

**Built with ❤️ using MERN Stack**
