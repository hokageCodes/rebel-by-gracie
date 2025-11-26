"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Are your bags handmade?",
    answer:
      "Yes, each bag is meticulously handcrafted by skilled artisans using premium materials. This ensures uniqueness and durability in every piece.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Absolutely. We ship worldwide with reliable courier services. Shipping fees and delivery times vary depending on your location.",
  },
  {
    question: "What materials are used in your collections?",
    answer:
      "We use high-quality leather, sustainable fabrics, and eco-conscious materials to balance luxury with responsibility.",
  },
  {
    question: "Can I request a custom design?",
    answer:
      "Currently, we do not accept custom design requests, but we occasionally release limited-edition collections you can look out for.",
  },
  {
    question: "What’s your return policy?",
    answer:
      "We accept returns within 14 days of delivery provided the item is unused, with tags, and in original packaging.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative w-full py-20 pt-24 md:pt-32 text-luxury-black">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-serif text-center mb-12">
          Frequently Asked Questions
        </h2>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Question */}
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium hover:bg-luxury-ivory transition"
                onClick={() => toggle(index)}
              >
                {faq.question}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 pb-4 text-secondary-700">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
