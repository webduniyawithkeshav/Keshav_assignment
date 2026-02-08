const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const Record = require('../models/Record');

/**
 * Distribute records equally among exactly 5 active agents
 * @param {Array} records - Parsed records from CSV/XLSX
 * @param {String} uploadedBy - Admin ObjectId who uploaded the file
 * @returns {Promise<Object>} Distribution result with batchId and statistics
 */
const distributeRecords = async (records, uploadedBy) => {
    try {
        // STEP 1: Fetch exactly 5 active agents (sorted by load for balancing)
        const agents = await Agent.find({ status: 'active' })
            .limit(5)
            .sort({ assignedRecordsCount: 1 }); // Least loaded agents first

        // EDGE CASE: Less than 5 active agents
        if (agents.length < 5) {
            throw new Error(
                `Need exactly 5 active agents for distribution. Currently ${agents.length} active agent(s) found. Please add ${5 - agents.length
                } more agent(s).`
            );
        }

        const totalRecords = records.length;
        const baseRecordsPerAgent = Math.floor(totalRecords / 5);
        const remainder = totalRecords % 5;

        // STEP 2: Calculate distribution
        // First 'remainder' agents get baseRecordsPerAgent + 1
        // Remaining agents get baseRecordsPerAgent
        const distribution = agents.map((agent, index) => ({
            agentId: agent._id,
            agentName: agent.name,
            agentEmail: agent.email,
            count: baseRecordsPerAgent + (index < remainder ? 1 : 0),
        }));

        // STEP 3: Generate unique batch ID
        const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // STEP 4: Create Record documents
        const recordDocs = [];
        let recordIndex = 0;

        distribution.forEach(({ agentId, count }) => {
            for (let i = 0; i < count; i++) {
                recordDocs.push({
                    batchId,
                    assignedAgent: agentId,
                    data: new Map(Object.entries(records[recordIndex])),
                    uploadedBy,
                    uploadedAt: new Date(),
                    status: 'pending',
                });
                recordIndex++;
            }
        });

        // STEP 5: Insert all records
        await Record.insertMany(recordDocs);

        // STEP 6: Update agent assigned counts
        for (const { agentId, count } of distribution) {
            await Agent.findByIdAndUpdate(
                agentId,
                { $inc: { assignedRecordsCount: count } }
            );
        }

        console.log(`✅ Distributed ${totalRecords} records across 5 agents`);

        return {
            success: true,
            batchId,
            totalRecords,
            distribution: distribution.map((d) => ({
                agentId: d.agentId,
                agentName: d.agentName,
                agentEmail: d.agentEmail,
                assignedCount: d.count,
            })),
        };
    } catch (error) {
        console.error('❌ Distribution error:', error);
        throw error;
    }
};

/**
 * Get distribution statistics
 * @returns {Promise<Object>} Statistics object
 */
const getDistributionStats = async () => {
    try {
        const totalRecords = await Record.countDocuments();

        const byAgent = await Record.aggregate([
            {
                $group: {
                    _id: '$assignedAgent',
                    count: { $sum: 1 },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                    },
                    in_progress: {
                        $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] },
                    },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                    },
                    failed: {
                        $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
                    },
                },
            },
            {
                $lookup: {
                    from: 'agents',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'agent',
                },
            },
            {
                $unwind: '$agent',
            },
            {
                $project: {
                    agentName: '$agent.name',
                    agentEmail: '$agent.email',
                    totalAssigned: '$count',
                    statusBreakdown: {
                        pending: '$pending',
                        in_progress: '$in_progress',
                        completed: '$completed',
                        failed: '$failed',
                    },
                },
            },
        ]);

        return {
            totalRecords,
            byAgent,
        };
    } catch (error) {
        throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
};

module.exports = {
    distributeRecords,
    getDistributionStats,
};
