import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/lib/models/Content';

// GET specific content page (public endpoint)
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { page } = await params;
    const content = await Content.findOne({ page, isActive: true });

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
