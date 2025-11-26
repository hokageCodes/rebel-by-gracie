import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4a2c23] to-[#5a3c33] text-white py-20 pt-32 md:pt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About RebelByGrace
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Crafting exceptional handbags and fashion accessories that embody elegance, 
              quality, and timeless style.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  RebelByGrace was born from a passion for exceptional craftsmanship and a desire 
                  to create handbags that stand the test of time. Our journey began with a simple 
                  belief: that every individual deserves access to premium quality accessories that 
                  reflect their unique style and personality.
                </p>
                <p>
                  We carefully curate each piece in our collection, working with skilled artisans 
                  who share our commitment to excellence. From the Women&apos;s Collection featuring 
                  elegant RG Midi and Mini handbags to our sophisticated Men&apos;s Collection with 
                  professional briefcases and laptop bags, every item tells a story of quality and refinement.
                </p>
                <p>
                  Our Travel Collection ensures that your adventures are accompanied by durable, 
                  stylish luggage that makes a statement wherever you go. At RebelByGrace, we 
                  believe that true luxury lies in the details&mdash;the perfect stitch, the finest 
                  materials, and the thoughtful design that anticipates your needs.
                </p>
              </div>
            </div>
            <div className="relative">
              <Link href="/gracie.jpeg" className="block">
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <Image
                    src="/gracie.jpeg"
                    alt="RebelByGrace Story"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at RebelByGrace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-20 h-20 bg-[#4a2c23] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Quality First
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We never compromise on quality. Every product is crafted with the finest materials 
                and attention to detail, ensuring longevity and satisfaction.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-20 h-20 bg-[#4a2c23] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Customer Care
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your satisfaction is our priority. We provide exceptional customer service and 
                support throughout your journey with RebelByGrace.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-20 h-20 bg-[#4a2c23] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Innovation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We continuously evolve our designs and processes to stay at the forefront of 
                fashion trends while maintaining our commitment to timeless elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4a2c23]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Experience RebelByGrace?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore our collections and discover the perfect handbag or accessory 
            that speaks to your unique style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/collections/womens" 
              className="px-8 py-4 bg-white text-[#4a2c23] font-semibold text-lg rounded-md hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Shop Women&apos;s Collection
            </Link>
            <Link 
              href="/collections/mens" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-md hover:bg-white hover:text-[#4a2c23] transition-colors"
            >
              Shop Men&apos;s Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
