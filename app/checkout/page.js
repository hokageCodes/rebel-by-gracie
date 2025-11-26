'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { MapPin, Phone, Mail, Package, CreditCard, Truck, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestEmail, setGuestEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId') || generateSessionId();
      if (!localStorage.getItem('sessionId')) {
        localStorage.setItem('sessionId', sessionId);
      }

      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await response.json();
      
      if (response.ok && data.cart && data.cart.items.length > 0) {
        setCart(data.cart);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = 0; // Free shipping
    return subtotal + shipping;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated && !guestEmail) {
      alert('Please provide your email address for order updates');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        items: cart.items,
        shippingAddress,
        guestEmail: !isAuthenticated ? guestEmail : null,
        notes: orderNotes,
        paymentMethod: 'cash_on_delivery',
        shippingCost: 0, // Free shipping for now
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order placed successfully!');
        // Clear cart
        const sessionId = localStorage.getItem('sessionId');
        await fetch(`/api/cart?sessionId=${sessionId}`, { method: 'DELETE' });
        
        // Redirect to success page
        router.push(`/order-success?orderNumber=${data.order.orderNumber}`);
      } else {
        toast.error(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 md:pt-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a2c23] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 md:pt-32">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to continue checkout</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-[#4a2c23] text-white px-6 py-3 rounded-md hover:bg-[#5a3c33] transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order below</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Mail className="w-5 h-5 text-[#4a2c23] mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Guest Email Collection */}
                {!isAuthenticated && (
                  <div>
                    <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="guestEmail"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors"
                      placeholder="your@email.com"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      We&apos;ll send you order updates and tracking information
                    </p>
                  </div>
                )}
                
                {isAuthenticated && (
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {user?.email}
                    </p>
                  </div>
                )}

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-[#4a2c23] mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Shipping Address</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          required
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          required
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <textarea
                        id="address"
                        required
                        rows={3}
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors resize-none"
                        placeholder="Street address, building, apartment number"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          required
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          required
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-[#4a2c23] transition-colors resize-none"
                    placeholder="Special delivery instructions or notes for your order"
                  />
                </div>
              </form>
            </div>

          {/* Order Summary - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="w-5 h-5 text-[#4a2c23] mr-2" />
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.product?.images && item.product.images.length > 0 && item.product.images[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product?.name || 'Product'}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized={!item.product.images[0].url?.includes('cloudinary')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {item.product?.name || 'Product'}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                      {item.variant && (
                        <p className="text-xs text-gray-500">
                          {item.variant.name}: {item.variant.options?.map(opt => opt.value).join(', ')}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-[#4a2c23] mt-2">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Shipping
                  </span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#4a2c23]">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-6 p-4 bg-[#4a2c23]/5 rounded-lg border border-[#4a2c23]/10">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-[#4a2c23] mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#4a2c23] mb-1">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-gray-600">
                      You&apos;ll pay when your order is delivered
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                <Lock className="w-3 h-3 mr-1" />
                Secure checkout
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                disabled={submitting}
                className={`w-full mt-6 py-4 px-6 rounded-md font-semibold text-white transition-all ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#4a2c23] hover:bg-[#5a3c33] shadow-lg hover:shadow-xl'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
