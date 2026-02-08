const path = require('path');
const Record = require('../models/Record');
const { parseFile, validateRecords, deleteFile } = require('../utils/csvParser');
const { distributeRecords, getDistributionStats } = require('../utils/distributor');

/**
 * Upload CSV/XLSX and distribute records
 * POST /api/records/upload
 */
const uploadAndDistribute = async (req, res, next) => {
    let filePath = null;

    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded. Please upload a CSV or XLSX file.',
            });
        }

        filePath = req.file.path;
        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        console.log(`📄 Processing file: ${req.file.originalname}`);

        // Parse file
        const records = await parseFile(filePath, fileExtension);

        // Validate records
        const validation = validateRecords(records, []); // Add required fields as needed
        if (!validation.isValid) {
            deleteFile(filePath);
            return res.status(422).json({
                success: false,
                error: 'File validation failed',
                details: validation.errors,
            });
        }

        // Distribute records
        const result = await distributeRecords(records, req.user.userId);

        // Delete file after successful processing
        deleteFile(filePath);

        res.status(200).json({
            success: true,
            message: `Successfully uploaded and distributed ${result.totalRecords} records`,
            data: result,
        });
    } catch (error) {
        // Clean up file on error
        if (filePath) {
            deleteFile(filePath);
        }
        next(error);
    }
};

/**
 * Get all records with pagination and filtering
 * GET /api/records
 */
const getAllRecords = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, agent, status, batchId } = req.query;

        const filter = {};
        if (agent) filter.assignedAgent = agent;
        if (status) filter.status = status;
        if (batchId) filter.batchId = batchId;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const records = await Record.find(filter)
            .populate('assignedAgent', 'name email')
            .populate('uploadedBy', 'name email')
            .sort({ uploadedAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Record.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: records,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get records by batch ID
 * GET /api/records/batch/:batchId
 */
const getRecordsByBatch = async (req, res, next) => {
    try {
        const records = await Record.find({ batchId: req.params.batchId })
            .populate('assignedAgent', 'name email')
            .populate('uploadedBy', 'name email')
            .sort({ assignedAgent: 1 });

        res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get records by agent ID
 * GET /api/records/agent/:agentId
 */
const getRecordsByAgent = async (req, res, next) => {
    try {
        const { status } = req.query;

        const filter = { assignedAgent: req.params.agentId };
        if (status) filter.status = status;

        const records = await Record.find(filter)
            .populate('uploadedBy', 'name email')
            .sort({ uploadedAt: -1 });

        res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update record status
 * PUT /api/records/:id/status
 */
const updateRecordStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;

        const updateData = { status };
        if (notes !== undefined) updateData.notes = notes;

        const record = await Record.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).populate('assignedAgent', 'name email');

        if (!record) {
            return res.status(404).json({
                success: false,
                error: 'Record not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Record status updated successfully',
            data: record,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get distribution statistics
 * GET /api/records/stats
 */
const getStats = async (req, res, next) => {
    try {
        const stats = await getDistributionStats();

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadAndDistribute,
    getAllRecords,
    getRecordsByBatch,
    getRecordsByAgent,
    updateRecordStatus,
    getStats,
};
