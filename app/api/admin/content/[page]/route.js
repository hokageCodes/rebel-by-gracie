import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Content from '@/lib/models/Content';

// GET specific content page
export async function GET(request, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { page } = await params;
    const content = await Content.findOne({ page });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      content,
    });

  } catch (error) {
    console.error('Content fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT update content page
export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { page } = await params;
    const updateData = await request.json();

    // Validate required fields - make content optional for hero-only updates
    if (!updateData.title && !updateData.sections) {
      return NextResponse.json(
        { error: 'Title or sections are required' },
        { status: 400 }
      );
    }

    const content = await Content.findOneAndUpdate(
      { page },
      { 
        ...updateData,
        lastModified: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      content,
    });

  } catch (error) {
    console.error('Content update error:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE content page
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    await connectDB();

    const { page } = await params;
    const content = await Content.findOneAndDelete({ page });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    });

  } catch (error) {
    console.error('Content deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
