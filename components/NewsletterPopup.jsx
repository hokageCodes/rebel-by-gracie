"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if popup was already dismissed
    const dismissed = localStorage.getItem("newsletterPopupDismissed");
    if (dismissed) return;

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletterPopupDismissed", "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-3xl font-serif text-black mb-3">
            Stay in the Loop
          </h2>
          <p className="text-base text-black/80 mb-6">
            Join our newsletter to receive exclusive updates, early access to new releases, and special offers.
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-md bg-gray-50 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a2c23] transition border border-gray-200"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-md bg-[#4a2c23] text-white font-semibold hover:bg-[#5a3c33] transition shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

