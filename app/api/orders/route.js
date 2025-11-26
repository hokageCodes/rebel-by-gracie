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

    // Get customer email
    const customerEmail = user?.email || orderData.guestEmail;
    if (!customerEmail) {
      return Response.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = orderData.shippingCost || 0;
    const totalAmount = subtotal + shippingCost;

    // Prepare shipping address with email
    const shippingAddress = {
      ...orderData.shippingAddress,
      email: customerEmail,
      street: orderData.shippingAddress.address || orderData.shippingAddress.street,
      zipCode: orderData.shippingAddress.postalCode || orderData.shippingAddress.zipCode,
      country: orderData.shippingAddress.country || 'Nigeria',
    };

    // Create order
    const order = new Order({
      user: user?._id,
      guestEmail: !user ? orderData.guestEmail : null,
      items: orderData.items,
      shippingAddress,
      paymentMethod: orderData.paymentMethod || 'cash_on_delivery',
      orderStatus: 'pending', // Start as pending, admin will confirm
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

    // Send email notifications
    try {
      // Email to customer
      const customerName = shippingAddress.firstName || 'Customer';
      const orderItemsHtml = order.items.map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong><br>
            <small>Quantity: ${item.quantity} × ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.price)}</small>
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
            ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.price * item.quantity)}
          </td>
        </tr>
      `).join('');

      await sendEmail({
        to: customerEmail,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4a2c23;">Thank you for your order, ${customerName}!</h2>
            <p>Your order has been received and is being processed.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span style="color: #f59e0b;">Pending Confirmation</span></p>
            </div>

            <h3>Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              ${orderItemsHtml}
              <tr>
                <td style="padding: 8px; border-top: 2px solid #4a2c23;"><strong>Subtotal</strong></td>
                <td style="padding: 8px; border-top: 2px solid #4a2c23; text-align: right;"><strong>${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.subtotal)}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px;">Shipping</td>
                <td style="padding: 8px; text-align: right;">${order.shippingCost === 0 ? 'Free' : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.shippingCost)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-top: 2px solid #4a2c23;"><strong>Total</strong></td>
                <td style="padding: 8px; border-top: 2px solid #4a2c23; text-align: right;"><strong>${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.totalAmount)}</strong></td>
              </tr>
            </table>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Shipping Address</h3>
              <p>
                ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
                ${shippingAddress.country}<br>
                Phone: ${shippingAddress.phone}
              </p>
            </div>

            <p style="color: #666; font-size: 14px;">
              Your order is pending confirmation. You will receive another email once your order is confirmed by our team.
            </p>
          </div>
        `,
        text: `Thank you for your order! Order Number: ${order.orderNumber}. Total: ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.totalAmount)}`
      });

      // Email to admin
      const adminUsers = await User.find({ role: 'admin' }).select('email');
      if (adminUsers.length > 0) {
        const adminEmails = adminUsers.map(u => u.email).join(', ');
        
        await sendEmail({
          to: adminEmails,
          subject: `New Order Received - ${order.orderNumber}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4a2c23;">New Order Received</h2>
              <p>A new order has been placed and requires confirmation.</p>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="margin-top: 0;">Order Summary</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Customer:</strong> ${shippingAddress.firstName} ${shippingAddress.lastName}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Phone:</strong> ${shippingAddress.phone}</p>
                <p><strong>Total Amount:</strong> ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.totalAmount)}</p>
                <p><strong>Items:</strong> ${order.items.length} item(s)</p>
                <p><strong>Status:</strong> <span style="color: #f59e0b;">Pending Confirmation</span></p>
              </div>

              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Items</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  ${orderItemsHtml}
                </table>
              </div>

              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Shipping Address</h3>
                <p>
                  ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
                  ${shippingAddress.street}<br>
                  ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
                  ${shippingAddress.country}<br>
                  Phone: ${shippingAddress.phone}
                </p>
              </div>

              <p style="margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/orders" 
                   style="background: #4a2c23; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View Order in Dashboard
                </a>
              </p>
            </div>
          `,
          text: `New order ${order.orderNumber} from ${shippingAddress.firstName} ${shippingAddress.lastName}. Total: ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.totalAmount)}`
        });
      }

      console.log('✅ Order confirmation emails sent');
    } catch (emailError) {
      console.error('❌ Error sending order emails:', emailError);
      // Don't fail the order creation if email fails
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
