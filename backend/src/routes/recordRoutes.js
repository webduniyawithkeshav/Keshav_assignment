const express = require('express');
const router = express.Router();
const {
    uploadAndDistribute,
    getAllRecords,
    getRecordsByBatch,
    getRecordsByAgent,
    updateRecordStatus,
    getStats,
} = require('../controllers/recordController');
const { recordValidation } = require('../middleware/validator');
const auth = require('../middleware/auth');
const upload = require('../config/upload');

// All routes are protected
router.use(auth);

/**
 * @route   POST /api/records/upload
 * @desc    Upload CSV/XLSX and distribute records
 * @access  Protected
 */
router.post('/upload', upload.single('file'), uploadAndDistribute);

/**
 * @route   GET /api/records/stats
 * @desc    Get distribution statistics
 * @access  Protected
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/records/batch/:batchId
 * @desc    Get records by batch ID
 * @access  Protected
 */
router.get('/batch/:batchId', getRecordsByBatch);

/**
 * @route   GET /api/records/agent/:agentId
 * @desc    Get records by agent ID
 * @access  Protected
 */
router.get('/agent/:agentId', getRecordsByAgent);

/**
 * @route   GET /api/records
 * @desc    Get all records (with pagination and filtering)
 * @access  Protected
 */
router.get('/', getAllRecords);

/**
 * @route   PUT /api/records/:id/status
 * @desc    Update record status
 * @access  Protected
 */
router.put('/:id/status', recordValidation.updateStatus, updateRecordStatus);

module.exports = router;
