'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const { user, logout, isAdmin, loading } = useAuth();

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId') || generateSessionId();
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.cart?.totalItems || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const generateSessionId = () => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCartCount(0);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const collections = [
    { name: "Women's Collection", href: "/collections/womens", categories: [
      { name: "RG Midi Handbag", href: "/collections/womens/rg-midi-handbag" },
      { name: "RG Mini Handbag", href: "/collections/womens/rg-mini-handbag" },
      { name: "Celia Clutch Purse", href: "/collections/womens/celia-clutch-purse" },
      { name: "The Livvy Bag", href: "/collections/womens/the-livvy-bag" },
      { name: "RG Box Mini", href: "/collections/womens/rg-box-mini" },
    ]},
    { name: "Men's Collection", href: "/collections/mens", categories: [
      { name: "Bull Briefcase", href: "/collections/mens/bull-briefcase" },
      { name: "Classic Laptop Bag", href: "/collections/mens/classic-laptop-bag" },
    ]},
    { name: "Travel Collection", href: "/collections/travel", categories: [
      { name: "RG Luxe Duffel Bag", href: "/collections/travel/rg-luxe-duffel-bag" },
    ]},
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50 md:h-28">
      {/* Desktop Layout with Center Logo */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Navigation Items Container - Fixed height */}
            <div className="flex justify-between items-center h-16">
              
              {/* Left Navigation */}
              <div className="flex items-center space-x-8 pt-12 flex-1">
                <Link href="/" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm font-medium">
                  Home
                </Link>
                
                {/* Collections Dropdown */}
                <div className="relative group">
                  <button className="text-secondary-700 hover:text-primary-600 transition-colors flex items-center space-x-1 text-sm font-medium">
                    <span>Collections</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {collections.map((collection) => (
                      <div key={collection.name} className="p-2">
                        <Link 
                          href={collection.href}
                          className="block px-3 py-2 text-sm font-medium text-secondary-800 hover:text-primary-600 hover:bg-secondary-50 rounded"
                        >
                          {collection.name}
                        </Link>
                        {collection.categories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            className="block px-6 py-1.5 text-xs text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 rounded"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/about" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm font-medium">
                  About
                </Link>
              </div>

              {/* Center Logo - Absolutely positioned, drops below nav */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 -mt-10">
                <Link href="/" className="block">
                    <img 
                      src="/rg-logonobg.png" 
                      alt="RebelByGrace Logo" 
                      className="h-48 w-48 object-contain"
                    />
                </Link>
              </div>

              {/* Right Navigation */}
              <div className="flex items-center space-x-8 pt-12 flex-1 justify-end">
                <Link href="/contact" className="text-secondary-700 hover:text-primary-600 transition-colors text-sm font-medium">
                  Contact
                </Link>

                {/* Cart */}
                <Link href="/cart" className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Account */}
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-secondary-200 animate-pulse" />
                ) : user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                        {user.firstName?.charAt(0).toUpperCase()}
                      </div>
                    </button>
                    
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="px-4 py-3 border-b border-secondary-200 bg-gradient-to-br from-primary-50 to-white">
                        <p className="text-sm font-semibold text-secondary-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-secondary-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/account" className="flex items-center px-4 py-2.5 text-sm text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          My Account
                        </Link>
                        <Link href="/orders" className="flex items-center px-4 py-2.5 text-sm text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="flex items-center px-4 py-2.5 text-sm text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-colors border-t border-secondary-200">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Dashboard
                          </Link>
                        )}
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-t border-secondary-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/login" className="text-secondary-700 hover:text-primary-600 transition-colors px-4 py-2 text-sm font-medium rounded-md hover:bg-secondary-50">
                      Login
                    </Link>
                    <Link href="/register" className="bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-700 transition-all shadow-md hover:shadow-lg">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Spacer for logo - prevents content overlap */}
            <div className="h-20"></div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Standard navbar */}
      <div className="lg:hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/rg-logonobg.png" 
                alt="RebelByGrace" 
                className="h-24 w-auto object-contain"
              />
            </Link>
            
            <div className="flex items-center space-x-3">
              {/* Mobile Cart */}
              <Link href="/cart" className="relative p-2 text-secondary-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-secondary-700 hover:text-primary-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="border-t border-secondary-200 py-4">
              <div className="space-y-1">
                <Link href="/" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                  Home
                </Link>
                <Link href="/collections/womens" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                  Women's Collection
                </Link>
                <Link href="/collections/mens" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                  Men's Collection
                </Link>
                <Link href="/collections/travel" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                  Travel Collection
                </Link>
                <Link href="/about" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                  About
                </Link>
                <Link href="/contact" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                  Contact
                </Link>

                {/* Mobile Auth Section */}
                {user ? (
                  <div className="border-t border-secondary-200 pt-4 mt-4 space-y-1">
                    <div className="px-3 py-2 text-sm font-semibold text-secondary-900 flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.firstName} {user.lastName}</span>
                    </div>
                    <Link href="/account" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                      My Account
                    </Link>
                    <Link href="/orders" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-secondary-200 pt-4 mt-4 space-y-2">
                    <Link href="/login" className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors">
                      Login
                    </Link>
                    <Link href="/register" className="block px-3 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md text-center font-medium transition-colors">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}