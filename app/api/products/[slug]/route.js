import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug) {
      return Response.json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }

    // Try to find by slug first
    let product = await Product.findOne({ 
      slug, 
      isActive: true 
    }).lean();

    // If not found by slug, try to find by _id (in case slug is actually an ID)
    if (!product && /^[0-9a-fA-F]{24}$/.test(slug)) {
      product = await Product.findOne({ 
        _id: slug, 
        isActive: true 
      }).lean();
    }

    if (!product) {
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Ensure product has a slug (generate if missing)
    if (!product.slug && product.name) {
      const slugify = (text) => {
        return text
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      };
      product.slug = slugify(product.name);
    }

    // Ensure _id is a string for client-side use
    if (product._id && typeof product._id !== 'string') {
      product._id = product._id.toString();
    }

    return Response.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    return Response.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
