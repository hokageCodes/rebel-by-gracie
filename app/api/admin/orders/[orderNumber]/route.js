import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

async function handler(request, { params }) {
  try {
    await connectDB();

    const { orderNumber } = await params;

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
      
      // Get the old order to check if status changed
      const oldOrder = await Order.findOne({ orderNumber })
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images')
        .lean();
      
      if (!oldOrder) {
        return Response.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      const order = await Order.findOneAndUpdate(
        { orderNumber },
        updateData,
        { new: true, runValidators: true }
      )
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images');

      // Send email if order status changed to confirmed
      if (updateData.orderStatus && updateData.orderStatus !== oldOrder.orderStatus) {
        try {
          const customerEmail = order.user?.email || order.guestEmail || order.shippingAddress?.email;
          const customerName = order.shippingAddress?.firstName || order.user?.firstName || 'Customer';
          
          if (customerEmail && updateData.orderStatus === 'confirmed') {
            await sendEmail({
              to: customerEmail,
              subject: `Order Confirmed - ${order.orderNumber}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #4a2c23;">Great news, ${customerName}!</h2>
                  <p>Your order <strong>${order.orderNumber}</strong> has been confirmed and is now being processed.</p>
                  
                  <div style="background: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;">
                    <h3 style="margin-top: 0; color: #065f46;">Order Status: Confirmed</h3>
                    <p>We're preparing your order for shipment. You'll receive another notification when your order ships.</p>
                  </div>

                  <p style="color: #666; font-size: 14px;">
                    If you have any questions, please don't hesitate to contact us.
                  </p>
                </div>
              `,
              text: `Your order ${order.orderNumber} has been confirmed and is being processed.`
            });
            console.log('✅ Order confirmation email sent to customer');
          }
        } catch (emailError) {
          console.error('❌ Error sending order confirmation email:', emailError);
          // Don't fail the update if email fails
        }
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
