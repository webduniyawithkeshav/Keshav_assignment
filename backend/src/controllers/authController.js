const Admin = require('../models/Admin');
const { generateToken } = require('../config/jwt');

/**
 * Register a new admin
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered',
            });
        }

        // Create new admin (password will be hashed automatically)
        const admin = await Admin.create({
            name,
            email,
            password,
        });

        // Generate JWT token
        const token = generateToken({
            userId: admin._id,
            email: admin.email,
            role: admin.role,
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login admin
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find admin by email (include password field)
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // Compare password
        const isPasswordCorrect = await admin.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: admin._id,
            email: admin.email,
            role: admin.role,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify token
 * GET /api/auth/verify
 */
const verifyTokenController = async (req, res, next) => {
    try {
        // User info is already attached by auth middleware
        const admin = await Admin.findById(req.user.userId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            valid: true,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    verifyTokenController,
};
