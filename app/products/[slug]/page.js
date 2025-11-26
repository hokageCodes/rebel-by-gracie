'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { addToCart } from '@/lib/utils/cart';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.slug}`);
      const data = await response.json();

      if (response.ok && data.product) {
        setProduct(data.product);
      } else {
        toast.error('Product not found');
        router.push('/shop');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error loading product');
      router.push('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product?._id) {
      toast.error('Product ID not available');
      return;
    }
    
    // Convert _id to string if it's an object
    const productId = typeof product._id === 'string' ? product._id : product._id.toString();
    
    const result = await addToCart(productId, quantity);
    if (result.success) {
      toast.success(result.message || 'Product added to cart!');
    } else {
      toast.error(result.error || 'Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a2c23] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const primaryImage = images[selectedImageIndex] || images[0];

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-[#4a2c23]">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/shop" className="text-gray-500 hover:text-[#4a2c23]">
            Shop
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {images.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="relative w-full h-96 md:h-[600px] bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-full h-24 bg-gray-200 rounded-lg overflow-hidden border-2 transition ${
                          selectedImageIndex === index
                            ? 'border-[#4a2c23]'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || `${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative w-full h-96 md:h-[600px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#4a2c23]">
                  ${product.price?.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-md">
                      Sale
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Product Info */}
            <div className="mb-6 space-y-2">
              {product.category && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Category:</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
              )}
              {product.productCollection && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Collection:</span>
                  <span className="text-gray-900 capitalize">{product.productCollection}</span>
                </div>
              )}
              {product.inventory !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Stock:</span>
                  <span className={product.inventory > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.inventory > 0 ? `${product.inventory} available` : 'Out of stock'}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 min-w-[4rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    disabled={product.inventory !== undefined && quantity >= product.inventory}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.inventory !== undefined && product.inventory === 0}
              className="w-full md:w-auto px-8 py-4 bg-[#4a2c23] text-white font-semibold text-lg rounded-md hover:bg-[#5a3c33] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Additional Info */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

