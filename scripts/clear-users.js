import connectDB from '../lib/mongodb.js';
import User from '../lib/models/User.js';

async function clearAllUsers() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    console.log('🗑️  Clearing all existing users...');
    const result = await User.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} users`);

    console.log('\n🎉 All users cleared! You can now register fresh accounts.');

  } catch (error) {
    console.error('❌ Error clearing users:', error);
    process.exit(1);
  }
}

clearAllUsers();
