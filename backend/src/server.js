const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// ============================
// Configuration
// ============================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================
// Database Connection
// ============================

connectDB();

// ============================
// Start Server
// ============================

const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Server running in ${NODE_ENV} mode`);
    console.log(`📡 Listening on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api`);
    console.log('='.repeat(50));
});

// ============================
// Graceful Shutdown
// ============================

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Process terminated!');
    });
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n👋 SIGINT RECEIVED. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Process terminated!');
        process.exit(0);
    });
});
