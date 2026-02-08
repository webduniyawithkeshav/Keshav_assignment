const mongoose = require('mongoose');
require('dotenv').config();

const Record = require('./src/models/Record');
const Agent = require('./src/models/Agent');

const checkDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-agent-system');
        console.log('✅ Connected to MongoDB\n');

        // Check records
        const recordCount = await Record.countDocuments();
        console.log(`📊 Total Records in Database: ${recordCount}`);

        if (recordCount > 0) {
            const sampleRecords = await Record.find().limit(3).populate('assignedAgent');
            console.log('\n📝 Sample Records:');
            sampleRecords.forEach((rec, idx) => {
                console.log(`  ${idx + 1}. Assigned to: ${rec.assignedAgent?.name || 'N/A'} | Status: ${rec.status}`);
            });
        }

        // Check agents
        const agents = await Agent.find();
        console.log(`\n👥 Total Agents: ${agents.length}`);
        agents.forEach((agent, idx) => {
            console.log(`  ${idx + 1}. ${agent.name} (${agent.email}) - Assigned: ${agent.assignedRecordsCount}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database check complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkDatabase();
