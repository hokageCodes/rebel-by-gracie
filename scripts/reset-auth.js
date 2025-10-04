import connectDB from '../lib/mongodb.js';
import User from '../lib/models/User.js';

async function resetAuthSystem() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();

    console.log('🗑️  Clearing all existing users...');
    await User.deleteMany({});
    console.log('✅ All users cleared');

    // Create a verified admin user for testing
    console.log('👤 Creating verified admin user...');
    const adminUser = new User({
      email: 'admin@localhost.com',
      password: 'admin123', // Will be automatically hashed
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      isEmailVerified: true, // Skip verification for testing
      phone: '+1234567890',
      address: {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'Admin Country'
      }
    });

    await adminUser.save();
    console.log('✅ Admin user created:', {
      email: adminUser.email,
      role: adminUser.role,
      verified: adminUser.isEmailVerified
    });

    // Create a verified customer user for testing
    console.log('👤 Creating verified customer user...');
    const customerUser = new User({
      email: 'customer@localhost.com',
      password: 'customer123', // Will be automatically hashed
      firstName: 'Customer',
      lastName: 'User',
      role: 'customer',
      isActive: true,
      isEmailVerified: true, // Skip verification for testing
      phone: '+1234567891',
      address: {
        street: '456 Customer St',
        city: 'Customer City',
        state: 'Customer State',
        zipCode: '54321',
        country: 'Customer Country'
      }
    });

    await customerUser.save();
    console.log('✅ Customer user created:', {
      email: customerUser.email,
      role: customerUser.role,
      verified: customerUser.isEmailVerified
    });

    console.log('\n🎉 Auth system reset complete!');
    console.log('\n📋 Login credentials:');
    console.log('Admin:');
    console.log('  Email: admin@localhost.com');
    console.log('  Password: admin123');
    console.log('\nCustomer:');
    console.log('  Email: customer@localhost.com');
    console.log('  Password: customer123');
    console.log('\n🚀 You can now login without email verification!');

  } catch (error) {
    console.error('❌ Error resetting auth system:', error);
    process.exit(1);
  }
}

resetAuthSystem();
