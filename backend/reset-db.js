const mongoose = require('mongoose');
require('dotenv').config();

const Record = require('./src/models/Record');
const Agent = require('./src/models/Agent');
const Admin = require('./src/models/Admin');

const resetDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-agent-system');
        console.log('✅ Connected to MongoDB\n');

        // Delete all records
        const recordsDeleted = await Record.deleteMany({});
        console.log(`🗑️  Deleted ${recordsDeleted.deletedCount} records`);

        // Delete all agents
        const agentsDeleted = await Agent.deleteMany({});
        console.log(`🗑️  Deleted ${agentsDeleted.deletedCount} agents`);

        // Keep admin account (don't delete)
        const adminCount = await Admin.countDocuments();
        console.log(`✅ Kept ${adminCount} admin account(s)\n`);

        console.log('📊 Database Status:');
        console.log(`   - Records: ${await Record.countDocuments()}`);
        console.log(`   - Agents: ${await Agent.countDocuments()}`);
        console.log(`   - Admins: ${await Admin.countDocuments()}`);

        console.log('\n✅ Database reset complete! Ready for fresh demo.');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetDatabase();
