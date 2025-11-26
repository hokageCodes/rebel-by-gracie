import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({ 
      slug, 
      isActive: true 
    }).lean();

    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return Response.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
