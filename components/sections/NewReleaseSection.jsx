"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react"
import { generateProductLink } from "../../lib/utils/slugify"
import { toast } from 'react-toastify'
import { addToCart } from '../../lib/utils/cart'
import { isValidObjectId } from '../../lib/utils/validation'

// Default fallback data
const defaultNewReleases = [
  { id: 1, src: "/bags/1.jpeg", title: "Vintage Camera Bag", price: "$40.85" },
  { id: 2, src: "/bags/2.jpeg", title: "Leather DSLR Bag", price: "$52.50" },
  { id: 3, src: "/bags/3.jpeg", title: "Compact Shoulder Bag", price: "$38.20" },
  { id: 4, src: "/bags/4.jpeg", title: "Modern Tote Bag", price: "$65.00" },
  { id: 5, src: "/bags/5.jpeg", title: "Executive Briefcase", price: "$120.00" },
]

export default function NewReleaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content/home')
        const data = await response.json()
        
        if (data.success && data.content?.sections?.newRelease) {
          setContent(data.content.sections.newRelease)
        }
        // If content not found (404), that's expected - we'll use default content
      } catch (error) {
        console.error('Error fetching new release content:', error)
        // Don't show toastify error for expected 404 responses
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  // Use managed content or fallback to default
  const sectionContent = content || {
    title: "New Release",
    subtitle: "Discover our latest handcrafted luxury bags",
    ctaText: "Explore the Shop",
    ctaLink: "/shop",
    products: defaultNewReleases.map((item, index) => ({
      id: item.id.toString(),
      name: item.title,
      image: { url: item.src, alt: item.title },
      price: parseFloat(item.price.replace('$', '')),
      link: generateProductLink(item.title),
      isCustomLink: false,
      isActive: true,
    })),
    isActive: true,
  }

  const activeProducts = sectionContent.products?.filter(product => product.isActive) || []
  const newReleases = activeProducts.length > 0 ? activeProducts : defaultNewReleases

  const nextSlide = () =>
    setActiveIndex((prev) => (prev + 1) % newReleases.length)
  const prevSlide = () =>
    setActiveIndex((prev) => (prev - 1 + newReleases.length) % newReleases.length)

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

  // same getPosition logic
  const getPosition = (index) => {
    const diff = (index - activeIndex + newReleases.length) % newReleases.length
    if (diff === 0) return "center"
    if (diff === 1 || diff === -(newReleases.length - 1)) return "right"
    if (diff === newReleases.length - 1 || diff === -1) return "left"
    return "hidden"
  }

  // Don't render if section is disabled
  if (!sectionContent.isActive) {
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
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          {sectionContent.title || "New Release"}
        </h2>
        <p className="mt-3 text-lg text-black/80">
          {sectionContent.subtitle || "Discover our latest handcrafted luxury bags"}
        </p>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center justify-center w-full max-w-6xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 p-3 rounded-md bg-black md:bg-white/20 md:hover:bg-white/40 transition"
        >
          <ChevronLeft className="text-white md:text-black w-6 h-6" />
        </button>

        {/* swipe container */}
        <motion.div
          className="flex items-center justify-center w-full h-[500px] relative overflow-hidden cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -150, right: 150 }}
          onDragEnd={(e, info) => {
            // swipe threshold
            if (info.offset.x < -100) nextSlide()
            if (info.offset.x > 100) prevSlide()
          }}
        >
          {newReleases.map((product, index) => {
            const position = getPosition(index)
            const productImage = product.image?.url || product.src
            const productTitle = product.name || product.title
            const productPrice = product.price ? `$${product.price.toFixed(2)}` : product.price
            const productLink = product.link || generateProductLink(productTitle)

            return (
              <motion.div
                key={product.id}
                animate={{
                  opacity: position === "hidden" ? 0 : 1,
                  scale: position === "center" ? 1.1 : 0.9,
                  x:
                    position === "center"
                      ? 0
                      : position === "left"
                      ? "-60%"
                      : position === "right"
                      ? "60%"
                      : "200%",
                  zIndex: position === "center" ? 10 : 5,
                }}
                transition={{ duration: 0.5 }}
                className="absolute w-80 bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                <Link href={productLink} className="block">
                  <div className="relative w-full h-80">
                    <Image
                      src={productImage}
                      alt={product.image?.alt || productTitle || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">
                    {productTitle}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 text-center mb-4">{productPrice}</p>
                  
                  {/* Action Icons - Always Visible */}
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      href={productLink}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </Link>
                    <button
                      onClick={(e) => {
                        const productId = product._id || product.id;
                        if (productId) {
                          handleAddToCart(e, productId);
                        } else {
                          toast.error('Product ID not available');
                        }
                      }}
                      className="w-10 h-10 bg-[#4a2c23] rounded-full flex items-center justify-center hover:bg-[#5a3c33] transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 p-3 rounded-md bg-black md:bg-white/20 hover:bg-white/40 transition"
        >
          <ChevronRight className="text-white md:text-black w-6 h-6" />
        </button>
      </div>

      {/* CTA */}
      {sectionContent.ctaText && (
        <div className="flex justify-center mt-10">
          <Link
            href={sectionContent.ctaLink || "/shop"}
            className="px-8 py-4 bg-[#4a2c23] text-white font-semibold text-lg rounded-md shadow-lg hover:bg-[#5a3c33] transition"
          >
            {sectionContent.ctaText}
          </Link>
        </div>
      )}
    </section>
  )
}
