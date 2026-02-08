const mongoose = require('mongoose');
require('dotenv').config();

const Record = require('./src/models/Record');
const Agent = require('./src/models/Agent');

const testStatsAPI = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-agent-system');
        console.log('✅ Connected to MongoDB\n');

        // Test the exact logic used in getDistributionStats
        const totalRecords = await Record.countDocuments();
        console.log(`Total Records: ${totalRecords}`);

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

        console.log(`\nBy Agent (${byAgent.length} agents):`);
        byAgent.forEach(agent => {
            console.log(`  - ${agent.agentName}: ${agent.totalAssigned} records`);
        });

        const result = {
            totalRecords,
            byAgent,
        };

        console.log('\n📊 Final Stats Object:');
        console.log(JSON.stringify(result, null, 2));

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testStatsAPI();
