'use client';

import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    productCollection: '',
    priceRange: '',
    isActive: '',
    isFeatured: '',
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage]);

  // Auto-filter when search term or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      fetchProducts();
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Debug logging
      console.log('Fetching products with:', {
        pagination,
        searchTerm,
        filters
      });
      
      const params = new URLSearchParams();
      params.append('page', (pagination?.currentPage || 1).toString());
      params.append('limit', '20');
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.productCollection) params.append('collection', filters.productCollection);
      if (filters?.priceRange) params.append('priceRange', filters.priceRange);
      if (filters?.isActive !== '' && filters?.isActive !== null && filters?.isActive !== undefined) {
        params.append('isActive', filters.isActive);
      }
      if (filters?.isFeatured !== '' && filters?.isFeatured !== null && filters?.isFeatured !== undefined) {
        params.append('isFeatured', filters.isFeatured);
      }
      
      const url = `/api/admin/products?${params.toString()}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      setProducts(data.data?.items || []);
      setPagination(data.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts(); // Refresh the list
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(); // Refresh the list
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      productCollection: '',
      priceRange: '',
      isActive: '',
      isFeatured: '',
    });
    setSearchTerm('');
    toast.info('Filters cleared');
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product._id));
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      const deletePromises = selectedProducts.map(id =>
        fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      setSelectedProducts([]);
      fetchProducts();
      alert(`${selectedProducts.length} products deleted successfully`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Error deleting products');
    }
  };

  const handleBulkStatusUpdate = async (isActive) => {
    if (selectedProducts.length === 0) return;

    try {
      const updatePromises = selectedProducts.map(id =>
        fetch(`/api/admin/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive }),
        })
      );
      
      await Promise.all(updatePromises);
      setSelectedProducts([]);
      fetchProducts();
      toast.success(`${selectedProducts.length} products updated successfully`);
    } catch (error) {
      console.error('Bulk update error:', error);
      toast.error('Error updating products');
    }
  };

  const handleToggleFeatured = async (productId, currentFeatured) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isFeatured: !currentFeatured 
        }),
      });

      if (response.ok) {
        fetchProducts();
        toast.success(`Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
      } else {
        const errorData = await response.json();
        console.error('Featured toggle error:', errorData);
        toast.error(`Failed to update product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Error updating product');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  const getFeaturedBadge = (isFeatured) => {
    return isFeatured ? (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 ml-2">
        Featured
      </span>
    ) : null;
  };

  if (showForm) {
    return (
      <ProductForm 
        product={editingProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Product</span>
        </button>
      </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 w-full relative">
                    <input
                      type="text"
                      placeholder="Search products by name, description, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                    {loading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <button
                      onClick={clearFilters}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Clear Filters</span>
                    </button>
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Categories</option>
                      <option value="womens-collection">Womens Collection</option>
                      <option value="rg-midi-handbag">RG Midi Handbag</option>
                      <option value="rg-mini-handbag">RG Mini Handbag</option>
                      <option value="celia-clutch-purse">Celia Clutch Purse</option>
                      <option value="the-livvy-bag">The Livvy Bag</option>
                      <option value="rg-box-mini">RG Box Mini</option>
                      <option value="mens-collection">Mens Collection</option>
                      <option value="bull-briefcase">Bull Briefcase</option>
                      <option value="classic-laptop-bag">Classic Laptop Bag</option>
                      <option value="travel-collection">Travel Collection</option>
                      <option value="rg-luxe-duffel-bag">RG Luxe Duffel Bag</option>
                    </select>
                  </div>

                  {/* Collection Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                    <select
                      value={filters.productCollection}
                      onChange={(e) => handleFilterChange('productCollection', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Collections</option>
                      <option value="womens">Womens</option>
                      <option value="mens">Mens</option>
                      <option value="travel">Travel</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Prices</option>
                      <option value="0-10000">₦0 - ₦10,000</option>
                      <option value="10000-25000">₦10,000 - ₦25,000</option>
                      <option value="25000-50000">₦25,000 - ₦50,000</option>
                      <option value="50000-100000">₦50,000 - ₦100,000</option>
                      <option value="100000+">₦100,000+</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.isActive}
                      onChange={(e) => handleFilterChange('isActive', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  {/* Featured Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                    <select
                      value={filters.isFeatured}
                      onChange={(e) => handleFilterChange('isFeatured', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Products</option>
                      <option value="true">Featured Only</option>
                      <option value="false">Not Featured</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center space-x-2">
                    <button
                      onClick={() => handleBulkStatusUpdate(true)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate(false)}
                      className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      Deactivate
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedProducts([])}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Products ({pagination.totalItems})
              </h2>
            </div>
            <div className="overflow-x-auto">
              {products.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-500">No products found</p>
                </div>
              ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedProducts.length === products.length && products.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-gray-300"
                            />
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inventory
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product._id)}
                                onChange={() => handleSelectProduct(product._id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3 sm:mr-4 overflow-hidden">
                              {product.images && product.images.length > 0 && product.images[0].url ? (
                                <img 
                                  src={product.images[0].url} 
                                  alt={product.name}
                                  className="object-cover rounded-lg w-full h-full"
                                  onError={(e) => {
                                    console.error('Image load error for', product.name, ':', product.images[0].url);
                                    e.target.style.display = 'none';
                                  }}
                                  onLoad={() => {
                                    console.log('Image loaded successfully for', product.name);
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-xs text-gray-500 mt-1">No image</span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{product.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500 truncate">{product.productCollection}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.inventory}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(product.isActive)}
                          {getFeaturedBadge(product.isFeatured)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                product.isFeatured 
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                            >
                              {product.isFeatured ? '⭐ Featured' : '☆ Feature'}
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-primary-600 hover:text-primary-900 px-2 py-1 text-xs rounded hover:bg-primary-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-900 px-2 py-1 text-xs rounded hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                        ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
