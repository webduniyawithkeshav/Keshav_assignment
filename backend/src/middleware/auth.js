const { verifyToken } = require('../config/jwt');
const Admin = require('../models/Admin');

/**
 * Authentication Middleware
 * Protects routes by verifying JWT token
 * Attaches user information to request object
 */
const auth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided. Authorization denied.',
            });
        }

        // Extract token (format: "Bearer <token>")
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token format. Authorization denied.',
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        // Optionally verify user still exists in database
        const admin = await Admin.findById(decoded.userId).select('-password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                error: 'User not found. Authorization denied.',
            });
        }

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);

        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token. Authorization denied.',
        });
    }
};

module.exports = auth;
