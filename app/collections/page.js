'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      // Fetch featured products from each collection
      const [womensResponse, mensResponse, travelResponse] = await Promise.all([
        fetch('/api/products?collection=womens&featured=true&limit=3'),
        fetch('/api/products?collection=mens&featured=true&limit=3'),
        fetch('/api/products?collection=travel&featured=true&limit=3'),
      ]);

      const womensData = await womensResponse.json();
      const mensData = await mensResponse.json();
      const travelData = await travelResponse.json();

      setCollections([
        {
          id: 'womens',
          name: 'Women\'s Collection',
          description: 'Discover our elegant collection of handbags, purses, and accessories designed for the modern woman.',
          href: '/collections/womens',
          products: womensData.products || [],
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
        },
        {
          id: 'mens',
          name: 'Men\'s Collection',
          description: 'Professional briefcases and laptop bags crafted for the discerning gentleman.',
          href: '/collections/mens',
          products: mensData.products || [],
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
        },
        {
          id: 'travel',
          name: 'Travel Collection',
          description: 'Premium travel bags and accessories for your adventures, near and far.',
          href: '/collections/travel',
          products: travelData.products || [],
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop',
        },
      ]);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading collections...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Collections</h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Discover our carefully curated selection of premium handbags and accessories
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {collections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{collection.name}</h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    {collection.description}
                  </p>
                  
                  {collection.products.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {collection.products.slice(0, 3).map((product) => (
                          <div key={product._id} className="text-center">
                            <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-primary-600 font-semibold">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Link
                    href={collection.href}
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Explore {collection.name}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Bag?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our complete catalog and discover the perfect accessory for your style
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
          >
            Shop All Products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
