const Agent = require('../models/Agent');

/**
 * Get all agents with pagination and filtering
 * GET /api/agents
 */
const getAllAgents = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const agents = await Agent.find(filter)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Agent.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: agents,
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
 * Get single agent by ID
 * GET /api/agents/:id
 */
const getAgentById = async (req, res, next) => {
    try {
        const agent = await Agent.findById(req.params.id).populate(
            'createdBy',
            'name email'
        );

        if (!agent) {
            return res.status(404).json({
                success: false,
                error: 'Agent not found',
            });
        }

        res.status(200).json({
            success: true,
            data: agent,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new agent
 * POST /api/agents
 */
const createAgent = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        const agent = await Agent.create({
            name,
            email,
            phone,
            createdBy: req.user.userId,
        });

        res.status(201).json({
            success: true,
            message: 'Agent created successfully',
            data: agent,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update agent
 * PUT /api/agents/:id
 */
const updateAgent = async (req, res, next) => {
    try {
        const { name, email, phone, status } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (status) updateData.status = status;

        const agent = await Agent.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!agent) {
            return res.status(404).json({
                success: false,
                error: 'Agent not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Agent updated successfully',
            data: agent,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete agent (soft delete by setting status to inactive)
 * DELETE /api/agents/:id
 */
const deleteAgent = async (req, res, next) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                error: 'Agent not found',
            });
        }

        // Check if agent has assigned records
        if (agent.assignedRecordsCount > 0) {
            return res.status(400).json({
                success: false,
                error: `Cannot delete agent with ${agent.assignedRecordsCount} assigned records. Please reassign or complete records first.`,
            });
        }

        // Soft delete: set status to inactive
        agent.status = 'inactive';
        await agent.save();

        res.status(200).json({
            success: true,
            message: 'Agent deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get active agent count
 * GET /api/agents/count
 */
const getActiveAgentCount = async (req, res, next) => {
    try {
        const count = await Agent.countDocuments({ status: 'active' });

        res.status(200).json({
            success: true,
            count,
            message: count === 5 ? 'Ready for distribution' : `Need ${5 - count} more agent(s)`,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
    getActiveAgentCount,
};
