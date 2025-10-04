import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';

async function handler(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (request.method === 'GET') {
      const product = await Product.findById(id);
      
      if (!product) {
        return Response.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return Response.json({ product });
    }

    if (request.method === 'PUT') {
      const updateData = await request.json();
      
      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!product) {
        return Response.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return Response.json({
        message: 'Product updated successfully',
        product,
      });
    }

    if (request.method === 'DELETE') {
      const product = await Product.findByIdAndDelete(id);
      
      if (!product) {
        return Response.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return Response.json({
        message: 'Product deleted successfully',
      });
    }

    return Response.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );

  } catch (error) {
    console.error('Admin product error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(handler);
export const PUT = requireAdmin(handler);
export const DELETE = requireAdmin(handler);
