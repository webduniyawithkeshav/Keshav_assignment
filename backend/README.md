# MERN Agent System - Backend

Production-ready backend for admin-agent management system with CSV upload and record distribution.

## 🚀 Features

- ✅ JWT authentication with bcrypt password hashing
- ✅ Agent CRUD operations with pagination
- ✅ CSV/XLSX file upload and validation
- ✅ Equal distribution across exactly 5 agents
- ✅ Transaction-based consistency
- ✅ Comprehensive error handling
- ✅ Input validation with express-validator
- ✅ MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js v16+ 
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
# Copy example env file
cp .env.example .env

# Edit .env and update values:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a secure random string)
# - FRONTEND_URL (your frontend URL for CORS)
```

3. **Start MongoDB** (if using local MongoDB)
```bash
mongod
```

4. **Run the server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── db.js        # MongoDB connection
│   │   ├── jwt.js       # JWT utilities
│   │   └── upload.js    # Multer config
│   ├── models/          # Mongoose schemas
│   │   ├── Admin.js     # Admin model
│   │   ├── Agent.js     # Agent model
│   │   └── Record.js    # Record model
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── app.js          # Express app
│   └── server.js       # Server entry point
├── uploads/            # Temporary file storage
├── .env               # Environment variables
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin
- `GET /api/auth/verify` - Verify token

### Agents
- `GET /api/agents` - Get all agents (paginated)
- `GET /api/agents/:id` - Get agent by ID
- `POST /api/agents` - Create agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `GET /api/agents/count` - Get active agent count

### Records
- `POST /api/records/upload` - Upload CSV/XLSX
- `GET /api/records` - Get all records (paginated)
- `GET /api/records/batch/:batchId` - Get records by batch
- `GET /api/records/agent/:agentId` - Get records by agent
- `PUT /api/records/:id/status` - Update record status
- `GET /api/records/stats` - Get distribution statistics

## 🔐 Authentication Flow

1. Register/Login → Receive JWT token
2. Include token in requests: `Authorization: Bearer <token>`
3. All routes except auth are protected

## 📊 Distribution Algorithm

- Requires **exactly 5 active agents**
- Distributes records equally using modulo arithmetic
- Example: 47 records → [10, 10, 9, 9, 9]
- Uses MongoDB transactions for consistency

## 🧪 Testing with Postman/Thunder Client

1. **Register Admin**
```json
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

2. **Login**
```json
POST http://localhost:5000/api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```
Save the `token` from response.

3. **Create 5 Agents** (repeat 5 times)
```json
POST http://localhost:5000/api/agents
Headers: Authorization: Bearer <token>
{
  "name": "Agent 1",
  "email": "agent1@example.com",
  "phone": "1234567890"
}
```

4. **Upload CSV**
```
POST http://localhost:5000/api/records/upload
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body: 
  file: <select CSV/XLSX file>
```

## 📝 Sample CSV Format

```csv
name,email,phone,company
John Doe,john@example.com,1234567890,ABC Corp
Jane Smith,jane@example.com,0987654321,XYZ Ltd
```

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-agent-system
JWT_SECRET=your-super-secret-key-min-256-bits
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
```

## 🛡️ Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token expiration
- Input validation and sanitization
- CORS protection
- File type and size validation
- MongoDB injection prevention

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `express-validator` - Input validation
- `multer` - File upload
- `csv-parser` - CSV parsing
- `xlsx` - Excel file parsing
- `morgan` - HTTP logger

### Development
- `nodemon` - Auto-restart server

## 🚨 Error Handling

- Global error handler middleware
- Specific handlers for:
  - Mongoose validation errors
  - Duplicate key errors
  - JWT errors
  - Multer upload errors
  - 404 Not Found

## 📄 License

ISC

## 👨‍💻 Author

MERN Stack Developer
