import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Cart from '@/lib/models/Cart';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function GET(request) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const guestEmail = searchParams.get('guestEmail');

    let orders;

    if (user) {
      orders = await Order.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate('items.product')
        .lean();
    } else if (guestEmail) {
      orders = await Order.find({ guestEmail })
        .sort({ createdAt: -1 })
        .populate('items.product')
        .lean();
    } else {
      return Response.json(
        { error: 'Authentication required or guest email needed' },
        { status: 401 }
      );
    }

    return Response.json({ orders });

  } catch (error) {
    console.error('Get orders error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const orderData = await request.json();
    const user = await getCurrentUser();

    // Validate required fields
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return Response.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!orderData.shippingAddress) {
      return Response.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = orderData.shippingCost || 0;
    const totalAmount = subtotal + shippingCost;

    // Create order
    const order = new Order({
      user: user?._id,
      guestEmail: !user ? orderData.guestEmail : null,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'cash_on_delivery',
      subtotal,
      shippingCost,
      totalAmount,
      notes: orderData.notes,
    });

    await order.save();
    await order.populate('items.product');

    // Clear cart if user is logged in
    if (user) {
      await Cart.findOneAndDelete({ userId: user._id });
    }

    return Response.json({
      message: 'Order created successfully',
      order,
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
