const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');
const recordRoutes = require('./routes/recordRoutes');

/**
 * Create Express application
 */
const app = express();

// ============================
// Middleware
// ============================

// Body parser (JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Allow requests from frontend
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ============================
// Routes
// ============================

// Health check route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'MERN Agent System API - Server is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/records', recordRoutes);

// ============================
// Error Handling
// ============================

// 404 Handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
