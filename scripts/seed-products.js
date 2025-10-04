import connectDB from '../lib/mongodb.js';
import Product from '../lib/models/Product.js';

const sampleProducts = [
  // Women's Collection
  {
    name: "RG Midi Handbag - Classic Black",
    slug: "rg-midi-handbag-classic-black",
    description: "A timeless midi-sized handbag that perfectly balances style and functionality. Crafted from premium leather with elegant gold hardware, this bag is perfect for both professional and casual occasions.",
    shortDescription: "Timeless midi-sized handbag in premium leather with gold hardware.",
    price: 45000,
    originalPrice: 55000,
    category: "rg-midi-handbag",
    collection: "womens",
    inventory: 25,
    isActive: true,
    isFeatured: true,
    tags: ["handbag", "leather", "midi", "black", "gold hardware"],
    weight: 0.8,
    dimensions: {
      length: 30,
      width: 12,
      height: 20
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        alt: "RG Midi Handbag Classic Black",
        isPrimary: true
      }
    ],
    seo: {
      metaTitle: "RG Midi Handbag Classic Black - Premium Leather Handbag",
      metaDescription: "Shop the RG Midi Handbag in classic black. Premium leather construction with gold hardware. Perfect for professional and casual wear.",
      metaKeywords: ["handbag", "leather", "midi", "black", "premium", "fashion"]
    }
  },
  {
    name: "RG Mini Handbag - Rose Gold",
    slug: "rg-mini-handbag-rose-gold",
    description: "A chic mini handbag that's perfect for evenings out or when you want to travel light. Features a luxurious rose gold chain strap and compact design that holds all your essentials.",
    shortDescription: "Chic mini handbag with rose gold chain strap for evening wear.",
    price: 35000,
    originalPrice: 42000,
    category: "rg-mini-handbag",
    collection: "womens",
    inventory: 20,
    isActive: true,
    isFeatured: true,
    tags: ["handbag", "mini", "rose gold", "chain", "evening"],
    weight: 0.4,
    dimensions: {
      length: 18,
      width: 8,
      height: 12
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
        alt: "RG Mini Handbag Rose Gold",
        isPrimary: true
      }
    ],
    seo: {
      metaTitle: "RG Mini Handbag Rose Gold - Evening Clutch Bag",
      metaDescription: "Elegant RG Mini Handbag in rose gold. Perfect for evening events and special occasions. Compact design with chain strap.",
      metaKeywords: ["mini handbag", "rose gold", "evening", "clutch", "chain strap"]
    }
  },
  {
    name: "Celia Clutch Purse - Emerald Green",
    slug: "celia-clutch-purse-emerald-green",
    description: "A sophisticated clutch purse that makes a statement. The rich emerald green leather is complemented by subtle silver hardware, creating an elegant accessory for formal events.",
    shortDescription: "Sophisticated emerald green clutch purse with silver hardware.",
    price: 28000,
    category: "celia-clutch-purse",
    collection: "womens",
    inventory: 15,
    isActive: true,
    isFeatured: false,
    tags: ["clutch", "purse", "emerald", "green", "formal", "elegant"],
    weight: 0.3,
    dimensions: {
      length: 22,
      width: 4,
      height: 14
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop",
        alt: "Celia Clutch Purse Emerald Green",
        isPrimary: true
      }
    ],
    seo: {
      metaTitle: "Celia Clutch Purse Emerald Green - Formal Evening Bag",
      metaDescription: "Elegant Celia Clutch Purse in rich emerald green. Perfect for formal events and special occasions.",
      metaKeywords: ["clutch purse", "emerald green", "formal", "evening bag", "elegant"]
    }
  },
  {
    name: "The Livvy Bag - Tan Leather",
    slug: "the-livvy-bag-tan-leather",
    description: "A versatile crossbody bag that's perfect for everyday use. The warm tan leather develops a beautiful patina over time, making each bag unique to its owner.",
    shortDescription: "Versatile tan leather crossbody bag for everyday use.",
    price: 38000,
    originalPrice: 45000,
    category: "the-livvy-bag",
    collection: "womens",
    inventory: 18,
    isActive: true,
    isFeatured: false,
    tags: ["crossbody", "tan", "leather", "everyday", "versatile"],
    weight: 0.6,
    dimensions: {
      length: 25,
      width: 10,
      height: 18
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        alt: "The Livvy Bag Tan Leather",
        isPrimary: true
      }
    ],
    seo: {
      metaTitle: "The Livvy Bag Tan Leather - Crossbody Handbag",
      metaDescription: "Versatile Livvy Bag in warm tan leather. Perfect crossbody bag for everyday use with adjustable strap.",
      metaKeywords: ["crossbody bag", "tan leather", "everyday", "adjustable strap", "versatile"]
    }
  },
  {
    name: "RG Box Mini - Navy Blue",
    slug: "rg-box-mini-navy-blue",
    description: "A structured mini bag with clean lines and modern appeal. The navy blue leather is durable and sophisticated, perfect for the contemporary woman.",
    shortDescription: "Structured navy blue mini bag with clean modern lines.",
    price: 32000,
    category: "rg-box-mini",
    collection: "womens",
    inventory: 22,
    isActive: true,
    isFeatured: false,
    tags: ["mini bag", "navy", "blue", "structured", "modern"],
    weight: 0.5,
    dimensions: {
      length: 20,
      width: 8,
      height: 16
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
        alt: "RG Box Mini Navy Blue",
        isPrimary: true
      }
    ],
    seo: {
      metaTitle: "RG Box Mini Navy Blue - Structured Mini Bag",
      metaDescription: "Modern RG Box Mini in navy blue leather. Structured design with clean lines for the contemporary woman.",
      metaKeywords: ["mini bag", "navy blue", "structured", "modern", "contemporary"]
    }
  },

  // Men's Collection
  {
    name: "Bull Briefcase - Black Leather",
    slug: "bull-briefcase-black-leather",
    description: "A professional briefcase that commands respect in any boardroom. Crafted from full-grain leather with multiple compartments for organization and a secure lock system.",
    shortDescription: "Professional black leather briefcase with secure lock system.",
    price: 65000,
    originalPrice: 75000,
    category: "bull-briefcase",
    collection: "mens",
    inventory: 12,
    isActive: true,
    isFeatured: true,
    tags: ["briefcase", "leather", "professional", "business", "secure"],
    weight: 1.2,
    dimensions: {
      length: 40,
      width: 15,
      height: 30
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        alt: "Bull Briefcase Black Leather",
        isPrimary: true
      }
    ],
    seo: {
      metaTitle: "Bull Briefcase Black Leather - Professional Business Briefcase",
      metaDescription: "Professional Bull Briefcase in black leather. Multiple compartments and secure lock system for business professionals.",
      metaKeywords: ["briefcase", "leather", "professional", "business", "secure", "boardroom"]
    }
  },
  {
    name: "Classic Laptop Bag - Brown Leather",
    slug: "classic-laptop-bag-brown-leather",
    description: "A sophisticated laptop bag that protects your devices while maintaining a professional appearance. Features padded compartments and a comfortable shoulder strap.",
    shortDescription: "Sophisticated brown leather laptop bag with padded compartments.",
    price: 42000,
    category: "classic-laptop-bag",
    collection: "mens",
    inventory: 16,
    isActive: true,
    isFeatured: false,
    tags: ["laptop bag", "brown", "leather", "padded", "professional"],
    weight: 1.0,
    dimensions: {
      length: 35,
      width: 12,
      height: 25
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        alt: "Classic Laptop Bag Brown Leather",
        isPrimary: true
      }
    ],
    seo: {
      metaTitle: "Classic Laptop Bag Brown Leather - Professional Laptop Protection",
      metaDescription: "Professional laptop bag in brown leather. Padded compartments and comfortable strap for daily commute.",
      metaKeywords: ["laptop bag", "brown leather", "padded", "professional", "protection"]
    }
  },

  // Travel Collection
  {
    name: "RG Luxe Duffel Bag - Charcoal",
    slug: "rg-luxe-duffel-bag-charcoal",
    description: "A premium duffel bag that combines luxury with functionality. Perfect for weekend getaways or business trips, featuring multiple pockets and a removable shoulder strap.",
    shortDescription: "Premium charcoal duffel bag for travel and weekend getaways.",
    price: 55000,
    originalPrice: 65000,
    category: "rg-luxe-duffel-bag",
    collection: "travel",
    inventory: 8,
    isActive: true,
    isFeatured: true,
    tags: ["duffel", "travel", "luxury", "charcoal", "weekend"],
    weight: 1.5,
    dimensions: {
      length: 50,
      width: 25,
      height: 30
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        alt: "RG Luxe Duffel Bag Charcoal",
        isPrimary: true
      }
    ],
    seo: {
      metaTitle: "RG Luxe Duffel Bag Charcoal - Premium Travel Bag",
      metaDescription: "Luxury RG Luxe Duffel Bag in charcoal. Perfect for travel and weekend getaways with multiple compartments.",
      metaKeywords: ["duffel bag", "travel", "luxury", "charcoal", "weekend", "getaway"]
    }
  }
];

async function seedProducts() {
  try {
    await connectDB();
    
    console.log('Starting product seeding...');
    
    // Clear existing products (optional - remove this if you want to keep existing products)
    // await Product.deleteMany({});
    // console.log('Cleared existing products');
    
    // Insert sample products
    for (const productData of sampleProducts) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        console.log(`Created product: ${product.name}`);
      } else {
        console.log(`Product already exists: ${productData.name}`);
      }
    }
    
    console.log('Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
