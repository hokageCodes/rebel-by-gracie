import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';

async function handler(request) {
  try {
    await connectDB();

    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 20;
      const search = searchParams.get('search');

      const query = {};
      if (search) {
        query.$text = { $search: search };
      }

      const skip = (page - 1) * limit;
      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Product.countDocuments(query);

      return Response.json({
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    }

    if (request.method === 'POST') {
      const productData = await request.json();
      
      // Validate required fields
      if (!productData.name || !productData.price || !productData.category || !productData.collection) {
        return Response.json(
          { error: 'Name, price, category, and collection are required' },
          { status: 400 }
        );
      }

      const product = new Product(productData);
      await product.save();

      return Response.json({
        message: 'Product created successfully',
        product,
      }, { status: 201 });
    }

    return Response.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );

  } catch (error) {
    console.error('Admin products error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(handler);
export const POST = requireAdmin(handler);
