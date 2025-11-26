import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Content from '@/lib/models/Content';

// POST seed basic content
export async function POST() {
  try {
    await requireAdmin();
    await connectDB();

    console.log('🌱 Seeding basic content...');

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

    return NextResponse.json({
      success: true,
      message: 'Content seeded successfully',
      content: existingContent,
    });

  } catch (error) {
    console.error('❌ Error seeding content:', error);
    return NextResponse.json(
      { error: 'Failed to seed content' },
      { status: 500 }
    );
  }
}
