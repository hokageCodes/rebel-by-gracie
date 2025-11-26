import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Content from '@/lib/models/Content';

// GET all content pages
export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const contents = await Content.find({ isActive: true })
      .select('-sections')
      .sort({ page: 1 });

    return NextResponse.json({
      success: true,
      contents,
    });

  } catch (error) {
    console.error('Content fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST create new content page
export async function POST(request) {
  try {
    await requireAdmin();
    await connectDB();

    const contentData = await request.json();
    
    // Validate required fields
    if (!contentData.page || !contentData.title || !contentData.content) {
      return NextResponse.json(
        { error: 'Page, title, and content are required' },
        { status: 400 }
      );
    }

    // Check if page already exists
    const existingContent = await Content.findOne({ page: contentData.page });
    if (existingContent) {
      return NextResponse.json(
        { error: 'Content for this page already exists' },
        { status: 400 }
      );
    }

    const content = new Content(contentData);
    await content.save();

    return NextResponse.json({
      success: true,
      message: 'Content created successfully',
      content,
    }, { status: 201 });

  } catch (error) {
    console.error('Content creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
