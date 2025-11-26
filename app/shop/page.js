'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { addToCart } from '@/lib/utils/cart';
import { toast } from 'react-toastify';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    collection: searchParams.get('collection') || '',
    sort: 'newest',
    search: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Get unique categories and collections from products
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Update filters from URL params if present
    const categoryFromUrl = searchParams.get('category') || '';
    const collectionFromUrl = searchParams.get('collection') || '';
    if (categoryFromUrl !== filters.category || collectionFromUrl !== filters.collection) {
      setFilters(prev => ({ 
        ...prev, 
        category: categoryFromUrl,
        collection: collectionFromUrl,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/products?limit=1000');
      const data = await response.json();
      
      if (data.products) {
        // Get unique categories
        const uniqueCategories = [...new Set(data.products
          .map(p => p.category)
          .filter(Boolean)
        )].map(cat => ({
          value: cat,
          label: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }));

        // Get unique collections
        const uniqueCollections = [...new Set(data.products
          .map(p => p.productCollection)
          .filter(Boolean)
        )].map(col => ({
          value: col,
          label: col.charAt(0).toUpperCase() + col.slice(1)
        }));

        setCategories([
          { value: '', label: 'All Categories' },
          ...uniqueCategories
        ]);
        setCollections([
          { value: '', label: 'All Collections' },
          ...uniqueCollections
        ]);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '12',
        ...(filters.category && { category: filters.category }),
        ...(filters.collection && { collection: filters.collection }),
        ...(filters.search && { search: filters.search }),
        ...(filters.sort && { sort: filters.sort }),
      });
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      setProducts(data.products || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      toast.success(result.message || 'Product added to cart!');
    } else {
      toast.error(result.error || 'Failed to add product to cart');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-[#4a2c23] to-[#5a3c33] flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/gallery/1.jpeg"
            alt="Shop"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            Shop All Products
          </h1>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#4a2c23]">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Shop</span>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-20 z-10 pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Collection Filter */}
            <div>
              <select
                value={filters.collection}
                onChange={(e) => handleFilterChange('collection', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent"
              >
                {collections.map((col) => (
                  <option key={col.value} value={col.value}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4a2c23] focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a2c23] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">No products available yet</p>
            <Link
              href="/collections"
              className="inline-block px-6 py-3 bg-[#4a2c23] text-white rounded-md hover:bg-[#5a3c33] transition"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative">
                      <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
                        {product.images && product.images.length > 0 && product.images[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name || 'Product image'}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            unoptimized={!product.images[0].url?.includes('cloudinary')}
                            onError={(e) => {
                              console.error('Image failed to load:', product.images[0].url);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center absolute inset-0">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2 bg-[#4a2c23] text-white text-xs px-2 py-1 rounded-md">
                          Featured
                        </div>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                          Sale
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-[#4a2c23] transition">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-[#4a2c23]">
                          ${product.price?.toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="w-full px-4 py-2 bg-[#4a2c23] text-white rounded-md hover:bg-[#5a3c33] transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a2c23] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}

