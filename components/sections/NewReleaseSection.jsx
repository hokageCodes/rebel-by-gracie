"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react"
import { toast } from 'react-toastify'
import { addToCart } from '../../lib/utils/cart'
import { isValidObjectId } from '../../lib/utils/validation'

export default function NewReleaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [products, setProducts] = useState([])
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch products from backend and content from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch content configuration
        const contentResponse = await fetch('/api/content/home')
        const contentData = await contentResponse.json()
        
        if (contentData.success && contentData.content?.sections?.newRelease) {
          setContent(contentData.content.sections.newRelease)
        }

        // Fetch real products from backend (newest or featured)
        const productsResponse = await fetch('/api/products?isActive=true&limit=5&sort=newest')
        const productsData = await productsResponse.json()
        
        if (productsData.products && productsData.products.length > 0) {
          // Filter to only products with valid ObjectIds
          const validProducts = productsData.products.filter(p => 
            p._id && isValidObjectId(p._id.toString())
          )
          setProducts(validProducts)
        }
      } catch (error) {
        console.error('Error fetching new release data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Use content config or defaults
  const sectionContent = content || {
    title: "New Release",
    subtitle: "Discover our latest handcrafted luxury bags",
    ctaText: "Explore the Shop",
    ctaLink: "/shop",
    isActive: true,
  }

  // Only show products with valid ObjectIds from backend
  const newReleases = products.filter(p => p._id && isValidObjectId(p._id.toString()))
  
  // Only show carousel controls if there's more than one product
  const hasMultipleProducts = newReleases.length > 1

  const nextSlide = () => {
    if (!hasMultipleProducts) return
    setActiveIndex((prev) => (prev + 1) % newReleases.length)
  }
  
  const prevSlide = () => {
    if (!hasMultipleProducts) return
    setActiveIndex((prev) => (prev - 1 + newReleases.length) % newReleases.length)
  }

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isValidObjectId(productId)) {
      toast.error('This product is not available for purchase yet');
      return;
    }
    
    const result = await addToCart(productId, 1);
    if (result.success) {
      toast.success(result.message || 'Product added to cart!');
    } else {
      toast.error(result.error || 'Failed to add product to cart');
    }
  };

  // Position logic - if only one product, always center
  const getPosition = (index) => {
    if (!hasMultipleProducts) {
      return index === activeIndex ? "center" : "hidden"
    }
    const diff = (index - activeIndex + newReleases.length) % newReleases.length
    if (diff === 0) return "center"
    if (diff === 1 || diff === -(newReleases.length - 1)) return "right"
    if (diff === newReleases.length - 1 || diff === -1) return "left"
    return "hidden"
  }

  // Don't render if section is disabled or no products available
  if (!sectionContent.isActive || newReleases.length === 0) {
    return null
  }

  if (loading) {
    return (
      <section className="relative w-full py-10 text-black overflow-hidden">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a2c23] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full py-10 pt-24 md:pt-32 text-black overflow-hidden">
      {/* Headline */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          {sectionContent.title || "New Release"}
        </h2>
        <p className="mt-2 sm:mt-3 text-base sm:text-lg text-black/80 max-w-2xl mx-auto">
          {sectionContent.subtitle || "Discover our latest handcrafted luxury bags"}
        </p>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Arrow - Only show if multiple products */}
        {hasMultipleProducts && (
          <button
            onClick={prevSlide}
            className="absolute left-0 sm:left-2 md:left-4 z-10 p-2 sm:p-3 rounded-md bg-black/70 md:bg-white/20 md:hover:bg-white/40 hover:bg-black/90 transition-all backdrop-blur-sm"
            aria-label="Previous product"
          >
            <ChevronLeft className="text-white md:text-black w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Swipe container */}
        <motion.div
          className={`flex items-center justify-center w-full h-[400px] sm:h-[450px] md:h-[500px] relative overflow-hidden ${
            hasMultipleProducts ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
          drag={hasMultipleProducts ? "x" : false}
          dragConstraints={hasMultipleProducts ? { left: -200, right: 200 } : undefined}
          dragElastic={hasMultipleProducts ? 0.2 : undefined}
          onDragEnd={(e, info) => {
            if (!hasMultipleProducts) return
            // Improved swipe threshold for better touch responsiveness
            const swipeThreshold = 50
            if (info.offset.x < -swipeThreshold) {
              nextSlide()
            } else if (info.offset.x > swipeThreshold) {
              prevSlide()
            }
          }}
          whileTap={hasMultipleProducts ? { scale: 0.98 } : undefined}
        >
          {newReleases.map((product, index) => {
            const position = getPosition(index)
            const productImage = product.images && product.images.length > 0 
              ? product.images[0].url 
              : '/bags/1.jpeg'
            const productTitle = product.name
            const productPrice = product.price ? `$${product.price.toFixed(2)}` : '$0.00'
            const productSlug = product.slug || product._id?.toString()
            const productLink = productSlug ? `/products/${productSlug}` : '#'
            const productId = product._id?.toString() || product._id

            return (
              <motion.div
                key={product._id?.toString() || index}
                animate={{
                  opacity: position === "hidden" ? 0 : 1,
                  scale: position === "center" 
                    ? (hasMultipleProducts ? 1.1 : 1) 
                    : (hasMultipleProducts ? 0.9 : 1),
                  x:
                    position === "center"
                      ? 0
                      : position === "left"
                      ? (hasMultipleProducts ? "-60%" : "0%")
                      : position === "right"
                      ? (hasMultipleProducts ? "60%" : "0%")
                      : "200%",
                  zIndex: position === "center" ? 10 : 5,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`absolute bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden group ${
                  hasMultipleProducts 
                    ? 'w-[280px] sm:w-[320px] md:w-80' 
                    : 'w-[90%] max-w-[320px] sm:max-w-[400px] md:max-w-[500px]'
                }`}
              >
                <Link href={productLink} className="block">
                  <div className={`relative w-full ${
                    hasMultipleProducts 
                      ? 'h-64 sm:h-72 md:h-80' 
                      : 'h-64 sm:h-80 md:h-96'
                  }`}>
                    <Image
                      src={productImage}
                      alt={product.images?.[0]?.alt || productTitle || "Product"}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 400px"
                      className="object-cover"
                      unoptimized={!productImage?.includes('cloudinary')}
                    />
                  </div>
                </Link>
                
                <div className="p-3 sm:p-4 bg-white">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center line-clamp-2">
                    {productTitle}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-3 sm:mb-4 mt-1">
                    {productPrice}
                  </p>
                  
                  {/* Action Icons - Always Visible */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <Link
                      href={productLink}
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="View product"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </Link>
                    <button
                      onClick={(e) => {
                        if (productId && isValidObjectId(productId)) {
                          handleAddToCart(e, productId);
                        } else {
                          toast.error('Product ID not available');
                        }
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-[#4a2c23] rounded-full flex items-center justify-center hover:bg-[#5a3c33] transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Right Arrow - Only show if multiple products */}
        {hasMultipleProducts && (
          <button
            onClick={nextSlide}
            className="absolute right-0 sm:right-2 md:right-4 z-10 p-2 sm:p-3 rounded-md bg-black/70 md:bg-white/20 md:hover:bg-white/40 hover:bg-black/90 transition-all backdrop-blur-sm"
            aria-label="Next product"
          >
            <ChevronRight className="text-white md:text-black w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* CTA */}
      {sectionContent.ctaText && (
        <div className="flex justify-center mt-8 sm:mt-10 px-4">
          <Link
            href={sectionContent.ctaLink || "/shop"}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-[#4a2c23] text-white font-semibold text-base sm:text-lg rounded-md shadow-lg hover:bg-[#5a3c33] transition-colors"
          >
            {sectionContent.ctaText}
          </Link>
        </div>
      )}
    </section>
  )
}
