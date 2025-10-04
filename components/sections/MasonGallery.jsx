'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { id: 1, src: '/gallery/1.jpeg', alt: 'Client Campaign 1' },
  { id: 2, src: '/gallery/2.jpeg', alt: 'Model Showcase 2' },
  { id: 3, src: '/gallery/3.jpeg', alt: 'Product Advert 3' },
  { id: 4, src: '/gallery/4.jpeg', alt: 'Client Campaign 4' },
  { id: 5, src: '/gallery/5.jpeg', alt: 'Behind the Scenes 5' },
  { id: 6, src: '/gallery/6.jpeg', alt: 'Advert Shoot 6' },
];

// Lazy Image component
function LazyImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="object-cover w-full h-full"
    />
  );
}

export default function MasonryGallerySection() {
  const [activeImage, setActiveImage] = useState(galleryImages[0]?.id || '');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);

  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 350;
      const newScrollLeft =
        containerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-16 text-white">
          Featured Campaigns
        </h2>

        {/* Desktop with Carousel */}
        <div className="hidden lg:block relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/80 border-2 border-white flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? 'opacity-100 hover:bg-white hover:text-black cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/80 border-2 border-white flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? 'opacity-100 hover:bg-white hover:text-black cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={containerRef}
            className="flex w-full h-[600px] gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-16"
          >
            {galleryImages.map((img) => {
              const isActive = activeImage === img.id;
              return (
                <div
                  key={img.id}
                  onClick={() => setActiveImage(img.id)}
                  className={`relative cursor-pointer transition-all duration-500 ease-in-out flex-shrink-0 ${
                    isActive ? 'w-[500px]' : 'w-[200px]'
                  } h-full rounded-2xl overflow-hidden border-4 ${
                    isActive
                      ? 'border-white shadow-2xl shadow-white/20'
                      : 'border-gray-700'
                  }`}
                >
                  <LazyImage src={img.src} alt={img.alt} />
                  {isActive && (
                    <div className="absolute bottom-6 left-6 right-6 bg-black/70 p-4 rounded-xl text-center">
                      <p className="text-white text-lg font-semibold">{img.alt}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="lg:hidden grid grid-cols-2 gap-4">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="relative w-full h-[250px] rounded-2xl overflow-hidden border-4 border-gray-700"
            >
              <LazyImage src={img.src} alt={img.alt} />
              <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-md">
                <p className="text-white text-xs">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
