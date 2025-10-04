import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
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
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-secondary-600">
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
              <div className="aspect-w-4 aspect-h-3 bg-secondary-200 rounded-lg overflow-hidden">
                <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-primary-800 mb-2">Craftsmanship</h3>
                    <p className="text-primary-700">Every detail matters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              The principles that guide everything we do at RebelByGrace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Quality First
              </h3>
              <p className="text-secondary-600">
                We never compromise on quality. Every product is crafted with the finest materials 
                and attention to detail, ensuring longevity and satisfaction.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Customer Care
              </h3>
              <p className="text-secondary-600">
                Your satisfaction is our priority. We provide exceptional customer service and 
                support throughout your journey with RebelByGrace.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Innovation
              </h3>
              <p className="text-secondary-600">
                We continuously evolve our designs and processes to stay at the forefront of 
                fashion trends while maintaining our commitment to timeless elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Our Collections
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Discover the carefully curated collections that define RebelByGrace.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Women's Collection */}
            <div className="card">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Women&apos;s Collection
                </h3>
                <p className="text-secondary-600 mb-4">
                  Elegant handbags and accessories designed for the modern woman who values 
                  both style and functionality.
                </p>
                <ul className="text-sm text-secondary-500 space-y-1">
                  <li>• RG Midi Handbag</li>
                  <li>• RG Mini Handbag</li>
                  <li>• Celia Clutch Purse</li>
                  <li>• The Livvy Bag</li>
                  <li>• RG Box Mini</li>
                </ul>
              </div>
            </div>

            {/* Men's Collection */}
            <div className="card">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Men&apos;s Collection
                </h3>
                <p className="text-secondary-600 mb-4">
                  Professional and stylish bags that complement the modern man&apos;s lifestyle 
                  and career aspirations.
                </p>
                <ul className="text-sm text-secondary-500 space-y-1">
                  <li>• Bull Briefcase</li>
                  <li>• Classic Laptop Bag</li>
                </ul>
              </div>
            </div>

            {/* Travel Collection */}
            <div className="card">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Travel Collection
                </h3>
                <p className="text-secondary-600 mb-4">
                  Durable and spacious bags designed to accompany you on all your adventures, 
                  near and far.
                </p>
                <ul className="text-sm text-secondary-500 space-y-1">
                  <li>• RG Luxe Duffel Bag</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience RebelByGrace?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Explore our collections and discover the perfect handbag or accessory 
            that speaks to your unique style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/collections/womens" className="btn-primary bg-white text-primary-600 hover:bg-secondary-100">
              Shop Women&apos;s Collection
            </a>
            <a href="/collections/mens" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Shop Men&apos;s Collection
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
