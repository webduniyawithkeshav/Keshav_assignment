const mongoose = require('mongoose');

/**
 * Agent Schema
 * Stores agent information for task assignment
 */
const agentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Agent name is required'],
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
        phone: {
            type: String,
            trim: true,
            default: null,
            match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number'],
        },
        status: {
            type: String,
            enum: {
                values: ['active', 'inactive'],
                message: 'Status must be either active or inactive',
            },
            default: 'active',
        },
        assignedRecordsCount: {
            type: Number,
            default: 0,
            min: [0, 'Assigned records count cannot be negative'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
agentSchema.index({ email: 1 });
agentSchema.index({ status: 1 });
agentSchema.index({ createdAt: -1 });
agentSchema.index({ assignedRecordsCount: 1 }); // For load balancing

/**
 * Pre-remove middleware: Prevent deletion if agent has assigned records
 */
agentSchema.pre('remove', async function (next) {
    if (this.assignedRecordsCount > 0) {
        return next(
            new Error('Cannot delete agent with assigned records. Reassign records first.')
        );
    }
    next();
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
