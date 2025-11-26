/**
 * Custom hook for cart count
 * Provides real-time cart count updates
 */

import { useState, useEffect } from 'react';
import { getCartCount } from '../utils/cart';

export function useCartCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    try {
      const cartCount = await getCartCount();
      setCount(cartCount);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCount();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('auth-state-changed', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('auth-state-changed', handleCartUpdate);
    };
  }, []);

  return { count, loading, refresh: fetchCount };
}

