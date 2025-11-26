'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
          image: womensData.products && womensData.products.length > 0 && womensData.products[0].images && womensData.products[0].images.length > 0 
            ? womensData.products[0].images[0].url 
            : '/gallery/1.jpeg',
        },
        {
          id: 'mens',
          name: 'Men\'s Collection',
          description: 'Professional briefcases and laptop bags crafted for the discerning gentleman.',
          href: '/collections/mens',
          products: mensData.products || [],
          image: mensData.products && mensData.products.length > 0 && mensData.products[0].images && mensData.products[0].images.length > 0 
            ? mensData.products[0].images[0].url 
            : '/gallery/2.jpeg',
        },
        {
          id: 'travel',
          name: 'Travel Collection',
          description: 'Premium travel bags and accessories for your adventures, near and far.',
          href: '/collections/travel',
          products: travelData.products || [],
          image: travelData.products && travelData.products.length > 0 && travelData.products[0].images && travelData.products[0].images.length > 0 
            ? travelData.products[0].images[0].url 
            : '/gallery/3.jpeg',
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a2c23] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: "url('/gallery/1.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white [text-shadow:_2px_2px_8px_rgb(0_0_0_/_0.9)]">
              Our Collections
            </h1>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 md:pt-32">
        <div className="space-y-16">
          {collections.map((collection) => (
            <div key={collection.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{collection.name}</h2>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    {collection.description}
                  </p>
                  
                  {collection.products.length > 0 ? (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {collection.products.slice(0, 3).map((product) => (
                          <div key={product._id} className="text-center">
                            <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  width={96}
                                  height={96}
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
                            <p className="text-sm text-[#4a2c23] font-semibold">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8 text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No products available yet in this collection.</p>
                    </div>
                  )}
                  
                  <Link
                    href={collection.href}
                    className="inline-flex items-center px-6 py-3 bg-[#4a2c23] text-white rounded-md hover:bg-[#5a3c33] transition-colors font-medium"
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
    </div>
  );
}
