"use client"
import Image from "next/image"

export default function FeaturedProduct() {
  return (
    <section
      className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden"
    >
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: "url('/bags/2.jpeg')", // 👈 featured product image
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <h2 className="text-4xl md:text-9xl font-serif tracking-wide mb-6">
          The Leather DSLR Bag
        </h2>
        {/* <p className="text-lg md:text-xl text-luxury-cream mb-8">
          Discover timeless craftsmanship and modern elegance, designed for photographers who demand both style and durability.
        </p> */}
        <a
          href="/shop"
          className="inline-block px-8 py-3 bg-luxury-black text-luxury-cream text-lg font-medium rounded-full shadow-lg hover:bg-luxury-graphite transition"
        >
          Shop Now
        </a>
      </div>
    </section>
  )
}
