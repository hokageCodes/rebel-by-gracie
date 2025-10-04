"use client"
import Image from "next/image"
import Link from "next/link"

const products = [
  { id: 1, src: "/bags/1.jpeg", title: "Vintage Camera Bag", price: "$40.85", height: "h-80" },
  { id: 2, src: "/bags/2.jpeg", title: "Leather DSLR Bag", price: "$52.50", height: "h-96" },
  { id: 3, src: "/bags/3.jpeg", title: "Compact Shoulder Bag", price: "$38.20", height: "h-80" },
]

export default function HeroShowcase() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#4a2c23] to-[#b08968] text-white overflow-hidden">
      
      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-center mb-16 sm:mb-24 drop-shadow-lg">
        Handcrafted Luxury Bags
      </h1>
      
      {/* Product Showcase */}
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end justify-center">
          {products.map((product) => (
            <Link
              key={product.id}
              href="/shop"
              className="bg-white rounded-2xl shadow-lg flex flex-col group hover:shadow-2xl transition overflow-hidden"
            >
              {/* Image */}
              <div className={`relative w-full ${product.height}`}>
                <Image
                  src={product.src}
                  alt={product.title}
                  fill
                  className="object-cover rounded-t-2xl group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-4 bg-white/90 rounded-b-2xl">
                <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
