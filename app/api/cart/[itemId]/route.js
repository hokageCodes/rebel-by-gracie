import connectDB from '@/lib/mongodb';
import Cart from '@/lib/models/Cart';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { itemId } = params;
    const { quantity } = await request.json();
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!quantity || quantity < 1) {
      return Response.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    // Find cart
    let cart;
    if (user) {
      cart = await Cart.findOne({ userId: user._id });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return Response.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (!cart) {
      return Response.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Find and update item
    const itemIndex = cart.items.findIndex(item => 
      item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return Response.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    return Response.json({
      message: 'Cart updated successfully',
      cart,
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { itemId } = params;
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    // Find cart
    let cart;
    if (user) {
      cart = await Cart.findOne({ userId: user._id });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return Response.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (!cart) {
      return Response.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Remove item
    cart.items = cart.items.filter(item => 
      item._id.toString() !== itemId
    );

    await cart.save();
    await cart.populate('items.product');

    return Response.json({
      message: 'Item removed from cart successfully',
      cart,
    });

  } catch (error) {
    console.error('Remove cart item error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
