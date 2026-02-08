const mongoose = require('mongoose');
require('dotenv').config();

const Record = require('./src/models/Record');
const Agent = require('./src/models/Agent');

const keepOneAgent = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-agent-system');
        console.log('✅ Connected to MongoDB\n');

        // Delete all records first
        const recordsDeleted = await Record.deleteMany({});
        console.log(`🗑️  Deleted ${recordsDeleted.deletedCount} records`);

        // Get all agents
        const agents = await Agent.find();
        console.log(`📊 Found ${agents.length} agents total`);

        if (agents.length === 0) {
            console.log('\n⚠️  No agents found. Database is already clean.');
        } else if (agents.length === 1) {
            console.log('\n✅ Already have only 1 agent. No changes needed.');
            console.log(`   - ${agents[0].name} (${agents[0].email})`);
        } else {
            // Keep first agent, delete the rest
            const keepAgent = agents[0];
            const deleteAgentIds = agents.slice(1).map(a => a._id);

            await Agent.deleteMany({ _id: { $in: deleteAgentIds } });

            // Reset the kept agent's record count to 0
            await Agent.findByIdAndUpdate(keepAgent._id, { assignedRecordsCount: 0 });

            console.log(`\n✅ Kept 1 agent, deleted ${agents.length - 1} agents`);
            console.log(`   Remaining agent: ${keepAgent.name} (${keepAgent.email})`);
        }

        // Final status
        console.log('\n📊 Final Database Status:');
        console.log(`   - Records: ${await Record.countDocuments()}`);
        console.log(`   - Agents: ${await Agent.countDocuments()}`);

        const remainingAgents = await Agent.find();
        if (remainingAgents.length > 0) {
            console.log('\n👤 Remaining Agent:');
            remainingAgents.forEach(agent => {
                console.log(`   - ${agent.name} (${agent.email}) - Phone: ${agent.phone}`);
            });
        }

        console.log('\n✅ Database cleanup complete! Ready for demo with 1 agent.');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

keepOneAgent();
