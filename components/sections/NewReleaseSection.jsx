"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const newReleases = [
  { id: 1, src: "/bags/1.jpeg", title: "Vintage Camera Bag", price: "$40.85" },
  { id: 2, src: "/bags/2.jpeg", title: "Leather DSLR Bag", price: "$52.50" },
  { id: 3, src: "/bags/3.jpeg", title: "Compact Shoulder Bag", price: "$38.20" },
  { id: 4, src: "/bags/4.jpeg", title: "Modern Tote Bag", price: "$65.00" },
  { id: 5, src: "/bags/5.jpeg", title: "Executive Briefcase", price: "$120.00" },
]

export default function NewReleaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () =>
    setActiveIndex((prev) => (prev + 1) % newReleases.length)
  const prevSlide = () =>
    setActiveIndex((prev) => (prev - 1 + newReleases.length) % newReleases.length)

  // same getPosition logic
  const getPosition = (index) => {
    const diff = (index - activeIndex + newReleases.length) % newReleases.length
    if (diff === 0) return "center"
    if (diff === 1 || diff === -(newReleases.length - 1)) return "right"
    if (diff === newReleases.length - 1 || diff === -1) return "left"
    return "hidden"
  }

  return (
    <section className="relative w-full py-10 text-black overflow-hidden">
      {/* Headline */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          New Release
        </h2>
        <p className="mt-3 text-lg text-black/80">
          Discover our latest handcrafted luxury bags
        </p>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center justify-center w-full max-w-6xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 p-3 rounded-full bg-black md:bg-white/20 md:hover:bg-white/40 transition"
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
                className="absolute w-80 bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="relative w-full h-80">
                  <Image
                    src={product.src}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-white/90">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{product.price}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 p-3 rounded-full bg-black md:bg-white/20 hover:bg-white/40 transition"
        >
          <ChevronRight className="text-white md:text-black w-6 h-6" />
        </button>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-16">
        <Link
          href="/shop"
          className="px-8 py-4 bg-white text-[#4a2c23] font-semibold text-lg rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Explore the Shop
        </Link>
      </div>
    </section>
  )
}
