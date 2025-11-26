import connectDB from '../lib/mongodb.js';
import Content from '../lib/models/Content.js';

const defaultHeroContent = {
  page: 'home',
  title: 'Rebel By Grace - Homepage',
  content: 'Welcome to Rebel By Grace, your destination for handcrafted luxury bags.',
  sections: {
    hero: {
      leftImage: {
        url: '/bags/1.jpeg',
        alt: 'Vintage Camera Bag',
        link: '/shop'
      },
      centerContent: {
        title: 'Handcrafted Luxury Bags',
        subtitle: 'Premium Quality, Timeless Design',
        description: 'Discover our collection of handcrafted bags made with the finest materials and attention to detail.',
        ctaText: 'Shop Now',
        ctaLink: '/shop',
        ctaStyle: 'primary'
      },
      rightImage: {
        url: '/bags/2.jpeg',
        alt: 'Leather DSLR Bag',
        link: '/shop'
      },
      background: {
        type: 'gradient'
      }
    }
  },
  meta: {
    description: 'Rebel By Grace - Handcrafted luxury bags with premium quality and timeless design.',
    keywords: 'luxury bags, handcrafted, leather, premium, fashion',
    ogTitle: 'Rebel By Grace - Handcrafted Luxury Bags',
    ogDescription: 'Discover our collection of handcrafted bags made with the finest materials.',
    ogImage: '/bags/1.jpeg'
  },
  isActive: true
};

async function seedHeroContent() {
  try {
    await connectDB();
    
    // Check if home content already exists
    const existingContent = await Content.findOne({ page: 'home' });
    
    if (existingContent) {
      console.log('Home content already exists. Updating with hero section...');
      
      // Update existing content with hero section
      await Content.findOneAndUpdate(
        { page: 'home' },
        { 
          $set: {
            sections: defaultHeroContent.sections,
            lastModified: new Date()
          }
        },
        { new: true }
      );
      
      console.log('✅ Home content updated with hero section!');
    } else {
      // Create new content
      const content = new Content(defaultHeroContent);
      await content.save();
      
      console.log('✅ Hero content created successfully!');
    }
    
    console.log('🎉 Hero content seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding hero content:', error);
  } finally {
    process.exit(0);
  }
}

seedHeroContent();
