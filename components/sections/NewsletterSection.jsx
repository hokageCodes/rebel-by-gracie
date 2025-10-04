"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <section className="py-20 px-6 lg:px-16 text-luxury-cream relative overflow-hidden">
      {/* Background Accent */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-luxury-graphite to-luxury-charcoal opacity-90"></div> */}

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-black mb-4">
          Stay in the Loop
        </h2>
        <p className="text-lg text-black/80 mb-10">
          Join our newsletter to receive exclusive updates, early access to new releases, and special offers.
        </p>

        {/* Newsletter Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-4 md:gap-2 max-w-2xl mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-6 py-4 rounded-xl bg-luxury-slate text-luxury-white placeholder-luxury-silver focus:outline-none focus:ring-2 focus:ring-luxury-pearl transition"
          />
          <button
            type="submit"
            className="px-8 py-4 rounded-xl bg-luxury-white text-luxury-black font-semibold hover:bg-luxury-cream transition shadow-md"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
