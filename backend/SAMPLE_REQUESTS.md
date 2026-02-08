# Admin Authentication API - Sample Request/Response Guide

## 🔐 POST /api/auth/login

### Request

**HTTP Method:** `POST`  
**Endpoint:** `http://localhost:5000/api/auth/login`  
**Content-Type:** `application/json`

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

### ✅ Success Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWRjMzQ1NjdhYmNkZWYwMTIzNDU2NzgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA3MzA5OTU1LCJleHAiOjE3MDc5MTQ3NTV9.K8J7XYZ9qW3mN5pL2rT6vB4cF1gH8jD0kM2nP9rS5tU",
  "user": {
    "id": "65dc34567abcdef012345678",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Store the token** - Use it in all subsequent requests

---

### ❌ Error Responses

#### 1. Invalid Credentials (401 Unauthorized)

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Reasons:**
- Email not found in database
- Password does not match

#### 2. Validation Error (400 Bad Request)

```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password is required"
    }
  ]
}
```

**Reasons:**
- Invalid email format
- Missing required fields

#### 3. Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Internal Server Error"
}
```

---

## 🛡️ Using the Token (Protected Routes)

### Example: Get All Agents

**Request:**
```http
GET http://localhost:5000/api/agents
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65dc45678bcdef012345679",
      "name": "Agent 1",
      "email": "agent1@example.com",
      "status": "active",
      "assignedRecordsCount": 10
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

### Example: Missing/Invalid Token

**Request:**
```http
GET http://localhost:5000/api/agents
# No Authorization header
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "No token provided. Authorization denied."
}
```

**Request with Invalid Token:**
```http
GET http://localhost:5000/api/agents
Authorization: Bearer invalid-token-here
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid or expired token. Authorization denied."
}
```

---

## 📋 Complete Login Flow Example

### Step 1: Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Step 2: Save Token from Response
```javascript
const response = {
  "success": true,
  "token": "eyJhbGciOiJIUzI1Ni...",  // ← Save this
  "user": { ... }
};

// Store in localStorage (frontend)
localStorage.setItem('token', response.token);
```

### Step 3: Use Token in Future Requests
```javascript
// Frontend example
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/agents', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🧪 Testing with Postman

### 1. Create Login Request
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 2. Save Token
- Click "Tests" tab
- Add script:
```javascript
pm.environment.set("auth_token", pm.response.json().token);
```

### 3. Use Token in Other Requests
- Method: GET
- URL: `http://localhost:5000/api/agents`
- Authorization: Bearer Token
- Token: `{{auth_token}}`

---

## 🔑 JWT Token Structure

**Encoded Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWRjMzQ1NjdhYmNkZWYwMTIzNDU2NzgiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA3MzA5OTU1LCJleHAiOjE3MDc5MTQ3NTV9.K8J7XYZ9qW3mN5pL2rT6vB4cF1gH8jD0kM2nP9rS5tU
```

**Decoded Payload:**
```json
{
  "userId": "65dc34567abcdef012345678",
  "email": "admin@example.com",
  "role": "admin",
  "iat": 1707309955,
  "exp": 1707914755
}
```

- `userId` - Admin's MongoDB ObjectId
- `email` - Admin's email
- `role` - Admin's role (admin/super_admin)
- `iat` - Issued at timestamp
- `exp` - Expiration timestamp (7 days later)

---

## ✅ Summary

**Endpoint:** `POST /api/auth/login`

**Request Body:**
- `email` (required, valid email)
- `password` (required, min 8 chars)

**Success Response:**
- `token` - JWT for authentication
- `user` - Admin details (id, name, email, role)

**Token Usage:**
- Include in all protected routes
- Format: `Authorization: Bearer <token>`
- Valid for 7 days
