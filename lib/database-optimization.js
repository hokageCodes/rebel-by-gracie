import connectDB from './mongodb.js';

// Database indexes for optimal performance
export const indexes = {
  // User indexes
  users: [
    { email: 1 }, // Unique index for login
    { role: 1 }, // For admin queries
    { isActive: 1 }, // For filtering active users
    { isEmailVerified: 1 }, // For email verification queries
    { createdAt: -1 }, // For sorting by creation date
    { firstName: 'text', lastName: 'text', email: 'text' }, // Text search
  ],

  // Product indexes
  products: [
    { slug: 1 }, // Unique index for product URLs
    { category: 1, isActive: 1 }, // For category filtering
    { collection: 1, isActive: 1 }, // For collection filtering
    { isFeatured: 1, isActive: 1 }, // For featured products
    { price: 1 }, // For price sorting
    { createdAt: -1 }, // For sorting by creation date
    { updatedAt: -1 }, // For sorting by updates
    { name: 'text', description: 'text', tags: 'text' }, // Text search
    { category: 1, collection: 1, isActive: 1 }, // Compound index for filtering
    { isActive: 1, isFeatured: 1, createdAt: -1 }, // Compound index for homepage
  ],

  // Order indexes
  orders: [
    { orderNumber: 1 }, // Unique index for order lookup
    { user: 1, createdAt: -1 }, // For user order history
    { guestEmail: 1, createdAt: -1 }, // For guest order history
    { orderStatus: 1 }, // For status filtering
    { paymentStatus: 1 }, // For payment filtering
    { createdAt: -1 }, // For sorting by date
    { orderStatus: 1, createdAt: -1 }, // Compound for admin queries
    { user: 1, orderStatus: 1 }, // Compound for user status queries
    { totalAmount: -1 }, // For revenue sorting
  ],

  // Cart indexes
  carts: [
    { userId: 1 }, // Unique index for user cart
    { updatedAt: -1 }, // For cleanup of old carts
  ],

  // Content indexes
  contents: [
    { page: 1 }, // Unique index for page lookup
    { updatedAt: -1 }, // For sorting by updates
  ],
};

// Create indexes for all collections
export async function createIndexes() {
  try {
    await connectDB();
    
    console.log('📊 Creating database indexes...');
    
    // Import models
    const User = (await import('./models/User.js')).default;
    const Product = (await import('./models/Product.js')).default;
    const Order = (await import('./models/Order.js')).default;
    const Cart = (await import('./models/Cart.js')).default;
    const Content = (await import('./models/Content.js')).default;
    
    const collections = { User, Product, Order, Cart, Content };
    
    for (const [modelName, Model] of Object.entries(collections)) {
      const collectionName = modelName.toLowerCase() + 's';
      const collectionIndexes = indexes[collectionName];
      
      if (collectionIndexes) {
        console.log(`📈 Creating indexes for ${collectionName}...`);
        
        for (const indexSpec of collectionIndexes) {
          try {
            // Check if index already exists
            const existingIndexes = await Model.collection.getIndexes();
            const indexExists = existingIndexes.some(idx => 
              JSON.stringify(idx.key) === JSON.stringify(indexSpec)
            );
            
            if (!indexExists) {
              await Model.collection.createIndex(indexSpec);
              console.log(`✅ Created index for ${collectionName}:`, indexSpec);
            } else {
              console.log(`⏭️  Index already exists for ${collectionName}:`, indexSpec);
            }
          } catch (error) {
            console.error(`❌ Error creating index for ${collectionName}:`, error.message);
          }
        }
      }
    }
    
    console.log('✅ Database indexing completed!');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

// Query optimization helpers
export const queryOptimizers = {
  // Product queries
  getProducts: (filters = {}) => {
    const query = { isActive: true };
    const sort = { createdAt: -1 };
    
    // Apply filters
    if (filters.category) query.category = filters.category;
    if (filters.collection) query.collection = filters.collection;
    if (filters.featured === 'true') query.isFeatured = true;
    if (filters.priceMin || filters.priceMax) {
      query.price = {};
      if (filters.priceMin) query.price.$gte = Number(filters.priceMin);
      if (filters.priceMax) query.price.$lte = Number(filters.priceMax);
    }
    
    // Text search
    if (filters.search) {
      query.$text = { $search: filters.search };
      sort.score = { $meta: 'textScore' };
    }
    
    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          sort.price = 1;
          delete sort.createdAt;
          break;
        case 'price-desc':
          sort.price = -1;
          delete sort.createdAt;
          break;
        case 'name-asc':
          sort.name = 1;
          delete sort.createdAt;
          break;
        case 'name-desc':
          sort.name = -1;
          delete sort.createdAt;
          break;
      }
    }
    
    return { query, sort };
  },
  
  // User queries
  getUsers: (filters = {}) => {
    const query = {};
    const sort = { createdAt: -1 };
    
    if (filters.role) query.role = filters.role;
    if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true';
    if (filters.isEmailVerified !== undefined) query.isEmailVerified = filters.isEmailVerified === 'true';
    
    // Text search
    if (filters.search) {
      query.$text = { $search: filters.search };
      sort.score = { $meta: 'textScore' };
    }
    
    return { query, sort };
  },
  
  // Order queries
  getOrders: (filters = {}) => {
    const query = {};
    const sort = { createdAt: -1 };
    
    if (filters.user) query.user = filters.user;
    if (filters.guestEmail) query.guestEmail = filters.guestEmail;
    if (filters.orderStatus) query.orderStatus = filters.orderStatus;
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
    
    // Date range
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }
    
    return { query, sort };
  },
};

// Database cleanup utilities
export const cleanupUtils = {
  // Remove old verification codes
  async cleanupExpiredVerificationCodes() {
    try {
      await connectDB();
      const User = (await import('./models/User.js')).default;
      
      const result = await User.updateMany(
        {
          verificationCode: { $ne: null },
          verificationCodeExpiry: { $lt: new Date() }
        },
        {
          $unset: { verificationCode: 1, verificationCodeExpiry: 1 }
        }
      );
      
      console.log(`🧹 Cleaned up ${result.modifiedCount} expired verification codes`);
      return result.modifiedCount;
    } catch (error) {
      console.error('❌ Error cleaning up verification codes:', error);
      return 0;
    }
  },
  
  // Remove old empty carts
  async cleanupOldCarts() {
    try {
      await connectDB();
      const Cart = (await import('./models/Cart.js')).default;
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const result = await Cart.deleteMany({
        updatedAt: { $lt: thirtyDaysAgo },
        items: { $size: 0 }
      });
      
      console.log(`🧹 Cleaned up ${result.deletedCount} old empty carts`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Error cleaning up old carts:', error);
      return 0;
    }
  },
  
  // Remove cancelled orders older than 6 months
  async cleanupOldCancelledOrders() {
    try {
      await connectDB();
      const Order = (await import('./models/Order.js')).default;
      
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      
      const result = await Order.deleteMany({
        orderStatus: 'cancelled',
        createdAt: { $lt: sixMonthsAgo }
      });
      
      console.log(`🧹 Cleaned up ${result.deletedCount} old cancelled orders`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Error cleaning up old cancelled orders:', error);
      return 0;
    }
  },
  
  // Run all cleanup tasks
  async runAllCleanup() {
    console.log('🧹 Starting database cleanup...');
    
    const results = await Promise.all([
      cleanupUtils.cleanupExpiredVerificationCodes(),
      cleanupUtils.cleanupOldCarts(),
      cleanupUtils.cleanupOldCancelledOrders(),
    ]);
    
    const total = results.reduce((sum, count) => sum + count, 0);
    console.log(`✅ Cleanup completed. ${total} records cleaned up.`);
    
    return total;
  },
};

// Database health check
export async function checkDatabaseHealth() {
  try {
    await connectDB();
    
    const stats = {
      connection: 'healthy',
      collections: {},
      indexes: {},
      timestamp: new Date().toISOString(),
    };
    
    // Check collections
    const collections = ['users', 'products', 'orders', 'carts', 'contents'];
    
    for (const collectionName of collections) {
      try {
        const db = (await import('./mongodb.js')).default;
        const collection = db.connection.db.collection(collectionName);
        
        stats.collections[collectionName] = {
          exists: true,
          count: await collection.countDocuments(),
          indexes: await collection.listIndexes().toArray(),
        };
      } catch (error) {
        stats.collections[collectionName] = {
          exists: false,
          error: error.message,
        };
      }
    }
    
    return stats;
  } catch (error) {
    return {
      connection: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

