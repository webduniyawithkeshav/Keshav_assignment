const express = require('express');
const router = express.Router();
const {
    getAllAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
    getActiveAgentCount,
} = require('../controllers/agentController');
const { agentValidation } = require('../middleware/validator');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

/**
 * @route   GET /api/agents/count
 * @desc    Get active agent count
 * @access  Protected
 */
router.get('/count', getActiveAgentCount);

/**
 * @route   GET /api/agents
 * @desc    Get all agents (with pagination and filtering)
 * @access  Protected
 */
router.get('/', getAllAgents);

/**
 * @route   GET /api/agents/:id
 * @desc    Get single agent by ID
 * @access  Protected
 */
router.get('/:id', getAgentById);

/**
 * @route   POST /api/agents
 * @desc    Create new agent
 * @access  Protected
 */
router.post('/', agentValidation.create, createAgent);

/**
 * @route   PUT /api/agents/:id
 * @desc    Update agent
 * @access  Protected
 */
router.put('/:id', agentValidation.update, updateAgent);

/**
 * @route   DELETE /api/agents/:id
 * @desc    Delete agent (soft delete)
 * @access  Protected
 */
router.delete('/:id', agentValidation.delete, deleteAgent);

module.exports = router;
