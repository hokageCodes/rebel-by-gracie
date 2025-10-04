import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';

async function handler(request, { params }) {
  try {
    await connectDB();

    const { orderNumber } = params;

    if (request.method === 'GET') {
      const order = await Order.findOne({ orderNumber })
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images')
        .lean();

      if (!order) {
        return Response.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return Response.json({ order });
    }

    if (request.method === 'PUT') {
      const updateData = await request.json();
      
      const order = await Order.findOneAndUpdate(
        { orderNumber },
        updateData,
        { new: true, runValidators: true }
      )
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images');

      if (!order) {
        return Response.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return Response.json({
        message: 'Order updated successfully',
        order,
      });
    }

    return Response.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );

  } catch (error) {
    console.error('Admin order error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(handler);
export const PUT = requireAdmin(handler);
