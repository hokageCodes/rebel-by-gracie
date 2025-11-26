"use client"
import Image from "next/image"

const previousCollections = [
  { id: 1, src: "/bags/5.jpeg", title: "Classic Tote Bag" },
  { id: 2, src: "/bags/6.jpeg", title: "Vintage Satchel" },
  { id: 3, src: "/bags/7.jpeg", title: "Retro Shoulder Bag" },
  { id: 4, src: "/bags/8.jpeg", title: "Limited Edition Backpack" },
  { id: 5, src: "/bags/9.jpeg", title: "Heritage Clutch" },
  { id: 6, src: "/bags/11.jpeg", title: "Travel Duffle" },
]

export default function PreviousCollections() {
  return (
    <section className="relative w-full py-20 pt-24 md:pt-32">
      <div className="container mx-auto px-2 max-w-7xl">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-serif text-center text-luxury-black mb-12">
          Previous Collections
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {previousCollections.map((item) => (
            <div key={item.id} className="relative group rounded-2xl overflow-hidden shadow-lg">
              {/* Image */}
              <Image
                src={item.src}
                alt={item.title}
                width={500}
                height={600}
                className="object-cover w-full h-[400px] transform group-hover:scale-105 transition duration-500"
              />
              {/* Overlay name */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                <h3 className="text-xl md:text-2xl font-serif text-luxury-cream drop-shadow-lg">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
