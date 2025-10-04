import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function seedAdmin() {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }
    
    // Create admin user
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@rebelbygrace.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    });
    
    await adminUser.save();
    console.log('Admin user created successfully:', adminUser.email);
    return adminUser;
    
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('Admin seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Admin seeding failed:', error);
      process.exit(1);
    });
}

