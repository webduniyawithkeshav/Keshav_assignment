const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Schema
 * Stores admin user credentials and profile information
 */
const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't return password in queries by default
        },
        role: {
            type: String,
            enum: ['admin', 'super_admin'],
            default: 'admin',
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Indexes for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ createdAt: -1 });

/**
 * Pre-save middleware: Hash password before saving
 * Only hash if password is modified
 */
adminSchema.pre('save', async function (next) {
    // Only hash password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Instance method: Compare password for login
 * @param {String} candidatePassword - Password to compare
 * @returns {Boolean} True if password matches
 */
adminSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Instance method: Get admin data without sensitive fields
 * @returns {Object} Safe admin object
 */
adminSchema.methods.toJSON = function () {
    const admin = this.toObject();
    delete admin.password;
    return admin;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
