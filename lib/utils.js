// Utility functions for the application

export function formatPrice(price) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getOrderStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function getCollectionInfo(collection) {
  const collections = {
    womens: {
      name: "Women's Collection",
      description: "Elegant handbags and accessories for the modern woman",
      categories: [
        { slug: 'rg-midi-handbag', name: 'RG Midi Handbag' },
        { slug: 'rg-mini-handbag', name: 'RG Mini Handbag' },
        { slug: 'celia-clutch-purse', name: 'Celia Clutch Purse' },
        { slug: 'the-livvy-bag', name: 'The Livvy Bag' },
        { slug: 'rg-box-mini', name: 'RG Box Mini' },
      ]
    },
    mens: {
      name: "Men's Collection",
      description: "Professional and stylish bags for the modern man",
      categories: [
        { slug: 'bull-briefcase', name: 'Bull Briefcase' },
        { slug: 'classic-laptop-bag', name: 'Classic Laptop Bag' },
      ]
    },
    travel: {
      name: "Travel Collection",
      description: "Durable and spacious bags for your adventures",
      categories: [
        { slug: 'rg-luxe-duffel-bag', name: 'RG Luxe Duffel Bag' },
      ]
    }
  };
  
  return collections[collection] || null;
}

export function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RBG${year}${month}${day}${random}`;
}
