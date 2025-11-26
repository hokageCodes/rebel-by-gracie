'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/hooks/useCart';

export default function CartPage() {
  const { cart, loading, updating, updateItem, removeItem, isEmpty: cartIsEmpty } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a2c23] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-[#4a2c23]">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Cart</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartIsEmpty ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-[#4a2c23] text-white rounded-md hover:bg-[#5a3c33] transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => {
                    const product = item.product;
                    const isUpdating = updating[item._id];

                    return (
                      <div key={item._id} className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <Link href={`/products/${product?.slug || ''}`} className="flex-shrink-0">
                            <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                              {product?.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product?.name || 'Product'}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1">
                            <Link href={`/products/${product?.slug || ''}`}>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-[#4a2c23] transition">
                                {product?.name || 'Product'}
                              </h3>
                            </Link>
                            <p className="text-gray-600 mt-1">${item.price?.toFixed(2) || '0.00'}</p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4 mt-4">
                              <label className="text-sm text-gray-700">Quantity:</label>
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() => updateItem(item._id, item.quantity - 1)}
                                  disabled={updating[item._id] || item.quantity <= 1}
                                  className="px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 min-w-[3rem] text-center">
                                  {updating[item._id] ? '...' : item.quantity}
                                </span>
                                <button
                                  onClick={() => updateItem(item._id, item.quantity + 1)}
                                  disabled={updating[item._id]}
                                  className="px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Price and Remove */}
                          <div className="flex flex-col items-end justify-between">
                            <p className="text-xl font-bold text-gray-900">
                              ${((item.price || 0) * item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() => removeItem(item._id)}
                              disabled={updating[item._id]}
                              className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${(cart.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-sm">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${(cart.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center px-6 py-3 bg-[#4a2c23] text-white rounded-md hover:bg-[#5a3c33] transition mb-4"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="block w-full text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

