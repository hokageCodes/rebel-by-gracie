import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pucit:orochimaru1@mfonbooks.krds7.mongodb.net/rebelbygrace';

async function setupIndexes() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Products Collection Indexes
    console.log('\n📦 Setting up Product indexes...');
    
    // Text search index for product search
    await db.collection('products').createIndex({
      name: 'text',
      description: 'text',
      shortDescription: 'text',
      tags: 'text'
    }, {
      weights: {
        name: 10,
        description: 5,
        shortDescription: 3,
        tags: 1
      },
      name: 'product_text_search'
    });

    // Category and collection index for filtering
    await db.collection('products').createIndex({ category: 1, collection: 1 });
    
    // Active products index for public queries
    await db.collection('products').createIndex({ isActive: 1, isFeatured: 1 });
    
    // Price range index for filtering
    await db.collection('products').createIndex({ price: 1 });
    
    // Created date index for sorting
    await db.collection('products').createIndex({ createdAt: -1 });
    
    // Slug index for product URLs
    await db.collection('products').createIndex({ slug: 1 }, { unique: true });

    console.log('✅ Product indexes created');

    // Orders Collection Indexes
    console.log('\n📋 Setting up Order indexes...');
    
    // Order number index (unique)
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    
    // Order status and date index for filtering
    await db.collection('orders').createIndex({ orderStatus: 1, createdAt: -1 });
    
    // Payment status index
    await db.collection('orders').createIndex({ paymentStatus: 1 });
    
    // User reference index
    await db.collection('orders').createIndex({ user: 1, createdAt: -1 });
    
    // Guest email index
    await db.collection('orders').createIndex({ guestEmail: 1 });
    
    // Total amount index for filtering
    await db.collection('orders').createIndex({ totalAmount: 1 });

    console.log('✅ Order indexes created');

    // Users Collection Indexes
    console.log('\n👥 Setting up User indexes...');
    
    // Email index (unique)
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Role index for admin queries
    await db.collection('users').createIndex({ role: 1 });
    
    // Email verification index
    await db.collection('users').createIndex({ isEmailVerified: 1 });
    
    // Active users index
    await db.collection('users').createIndex({ isActive: 1 });
    
    // Created date index for sorting
    await db.collection('users').createIndex({ createdAt: -1 });
    
    // Phone index for search
    await db.collection('users').createIndex({ phone: 1 });

    console.log('✅ User indexes created');

    // Cart Collection Indexes
    console.log('\n🛒 Setting up Cart indexes...');
    
    // User cart index
    await db.collection('carts').createIndex({ user: 1 });
    
    // Session cart index
    await db.collection('carts').createIndex({ sessionId: 1 });
    
    // Updated date index for cleanup
    await db.collection('carts').createIndex({ updatedAt: -1 });

    console.log('✅ Cart indexes created');

    console.log('\n🎉 All indexes created successfully!');
    console.log('\n📊 Index Summary:');
    console.log('- Products: Text search, category/collection, active/featured, price, date, slug');
    console.log('- Orders: Order number, status/date, payment status, user, guest email, amount');
    console.log('- Users: Email, role, verification, active, date, phone');
    console.log('- Carts: User, session, date');

  } catch (error) {
    console.error('❌ Error setting up indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the setup
setupIndexes();
