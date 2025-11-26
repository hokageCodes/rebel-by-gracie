import connectDB from '@/lib/mongodb';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    let cart;

    if (user) {
      // Get user's cart
      cart = await Cart.findOne({ userId: user._id }).populate('items.product');
    } else if (sessionId) {
      // Get guest cart
      cart = await Cart.findOne({ sessionId }).populate('items.product');
    } else {
      return Response.json({ cart: null });
    }

    if (!cart) {
      cart = new Cart({
        userId: user?._id,
        sessionId: sessionId,
        items: [],
      });
      await cart.save();
    }

    return Response.json({ cart });

  } catch (error) {
    console.error('Get cart error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const { productId, quantity = 1, variant, sessionId } = await request.json();
    const user = await getCurrentUser();

    if (!productId) {
      return Response.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate productId is a valid MongoDB ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      return Response.json(
        { error: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return Response.json(
        { error: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    // Calculate price (including variant pricing)
    let price = product.price;
    if (variant && variant.options) {
      variant.options.forEach(option => {
        const variantOption = product.variants
          .find(v => v.name === variant.name)
          ?.options?.find(o => o.name === option.name && o.value === option.value);
        if (variantOption) {
          price += variantOption.additionalPrice || 0;
        }
      });
    }

    // Find or create cart
    let cart;
    if (user) {
      cart = await Cart.findOne({ userId: user._id });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      cart = new Cart({
        userId: user?._id,
        sessionId: sessionId,
        items: [],
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = price; // Update price in case it changed
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        variant,
        price,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    return Response.json({
      message: 'Item added to cart successfully',
      cart,
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
