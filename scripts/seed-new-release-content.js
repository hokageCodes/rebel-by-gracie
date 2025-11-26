// Script to seed New Release section content
import mongoose from 'mongoose';
import Content from '../lib/models/Content.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rebelbygrace';

async function seedNewReleaseContent() {
  try {
    console.log('🌱 Seeding New Release section content...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // New Release section data
    const newReleaseData = {
      title: "New Release",
      subtitle: "Discover our latest handcrafted luxury bags",
      ctaText: "Explore the Shop",
      ctaLink: "/shop",
      products: [
        {
          id: "1",
          name: "Vintage Camera Bag",
          image: {
            url: "/bags/1.jpeg",
            alt: "Vintage Camera Bag - Premium leather with classic design"
          },
          price: 40.85,
          link: "/products/vintage-camera-bag",
          isCustomLink: false,
          isActive: true
        },
        {
          id: "2", 
          name: "Leather DSLR Bag",
          image: {
            url: "/bags/2.jpeg",
            alt: "Leather DSLR Bag - Professional camera protection"
          },
          price: 52.50,
          link: "/products/leather-dslr-bag",
          isCustomLink: false,
          isActive: true
        },
        {
          id: "3",
          name: "Compact Shoulder Bag",
          image: {
            url: "/bags/3.jpeg",
            alt: "Compact Shoulder Bag - Perfect for daily essentials"
          },
          price: 38.20,
          link: "/products/compact-shoulder-bag",
          isCustomLink: false,
          isActive: true
        },
        {
          id: "4",
          name: "Modern Tote Bag",
          image: {
            url: "/bags/4.jpeg",
            alt: "Modern Tote Bag - Stylish and spacious"
          },
          price: 65.00,
          link: "/products/modern-tote-bag",
          isCustomLink: false,
          isActive: true
        },
        {
          id: "5",
          name: "Executive Briefcase",
          image: {
            url: "/bags/5.jpeg",
            alt: "Executive Briefcase - Professional and elegant"
          },
          price: 120.00,
          link: "/products/executive-briefcase",
          isCustomLink: false,
          isActive: true
        }
      ],
      isActive: true
    };

    // Check if home content exists
    let homeContent = await Content.findOne({ page: 'home' });
    
    if (!homeContent) {
      console.log('📄 Creating new home content...');
      homeContent = new Content({
        page: 'home',
        title: 'Homepage',
        sections: {
          newRelease: newReleaseData
        }
      });
    } else {
      console.log('📄 Updating existing home content...');
      // Update or add newRelease section
      if (!homeContent.sections) {
        homeContent.sections = {};
      }
      homeContent.sections.newRelease = newReleaseData;
    }

    // Save the content
    await homeContent.save();
    console.log('✅ New Release section content saved successfully!');
    
    console.log('📊 Summary:');
    console.log(`   - Section: ${newReleaseData.title}`);
    console.log(`   - Products: ${newReleaseData.products.length}`);
    console.log(`   - Active: ${newReleaseData.isActive}`);
    console.log(`   - CTA: "${newReleaseData.ctaText}" → ${newReleaseData.ctaLink}`);

  } catch (error) {
    console.error('❌ Error seeding New Release content:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding function
seedNewReleaseContent();
