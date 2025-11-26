import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { orderNumber } = await params;
    const user = await getCurrentUser();

    const order = await Order.findOne({ orderNumber })
      .populate('items.product')
      .lean();

    if (!order) {
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this order
    if (user && order.user && order.user.toString() !== user._id.toString()) {
      return Response.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    if (!user && order.guestEmail) {
      // For guest orders, we might want to verify email or use session
      // For now, we'll allow access with order number
    }

    return Response.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
