// Script to seed basic content for the website
import mongoose from 'mongoose';
import Content from '../lib/models/Content.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rebelbygrace';

async function seedBasicContent() {
  try {
    console.log('🌱 Seeding basic content...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Basic home content
    const homeContent = {
      page: 'home',
      title: 'Homepage',
      content: 'Welcome to Rebel by Grace - Handcrafted Luxury Bags',
      sections: {
        hero: {
          centerContent: {
            title: "Handcrafted Luxury Bags",
            subtitle: "Premium Quality, Timeless Design",
            description: "Discover our collection of handcrafted bags made with the finest materials",
            ctaText: "Shop Now",
            ctaLink: "/shop",
            ctaStyle: "primary"
          },
          background: { type: "gradient" }
        },
        newRelease: {
          title: "New Release",
          subtitle: "Discover our latest handcrafted luxury bags",
          ctaText: "Explore the Shop",
          ctaLink: "/shop",
          products: [],
          isActive: true
        }
      }
    };

    // Check if home content exists
    let existingContent = await Content.findOne({ page: 'home' });
    
    if (!existingContent) {
      console.log('📄 Creating new home content...');
      existingContent = new Content(homeContent);
    } else {
      console.log('📄 Updating existing home content...');
      // Update sections if they don't exist
      if (!existingContent.sections) {
        existingContent.sections = homeContent.sections;
      } else {
        // Merge sections
        Object.keys(homeContent.sections).forEach(sectionKey => {
          if (!existingContent.sections[sectionKey]) {
            existingContent.sections[sectionKey] = homeContent.sections[sectionKey];
          }
        });
      }
    }

    // Save the content
    await existingContent.save();
    console.log('✅ Basic content saved successfully!');

  } catch (error) {
    console.error('❌ Error seeding basic content:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding function
seedBasicContent();
