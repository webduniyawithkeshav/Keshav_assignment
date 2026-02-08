const mongoose = require('mongoose');

/**
 * Record Schema
 * Stores uploaded CSV/XLSX records assigned to agents
 * Uses Map type for flexible dynamic column storage
 */
const recordSchema = new mongoose.Schema(
    {
        batchId: {
            type: String,
            required: [true, 'Batch ID is required'],
            index: true,
        },
        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Agent',
            required: [true, 'Assigned agent is required'],
            index: true,
        },
        // Dynamic data storage for CSV columns
        // Stores as key-value pairs: { "name": "John", "email": "john@example.com", ... }
        data: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            required: [true, 'Record data is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'in_progress', 'completed', 'failed'],
                message: 'Invalid status value',
            },
            default: 'pending',
            index: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Uploader information is required'],
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        notes: {
            type: String,
            default: '',
            maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for efficient queries
recordSchema.index({ batchId: 1, assignedAgent: 1 });
recordSchema.index({ assignedAgent: 1, status: 1 });
recordSchema.index({ uploadedAt: -1 });

/**
 * Pre-save middleware: Set completedAt when status changes to completed
 */
recordSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
        this.completedAt = new Date();
    }
    next();
});

/**
 * Instance method: Convert data Map to plain object for JSON response
 */
recordSchema.methods.toJSON = function () {
    const record = this.toObject();
    // Convert Map to plain object
    if (record.data instanceof Map) {
        record.data = Object.fromEntries(record.data);
    }
    return record;
};

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
