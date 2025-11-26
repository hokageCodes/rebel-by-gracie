/**
 * Custom hook for cart operations
 * Provides cart state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../utils/cart';

export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCart();
      if (result.success) {
        setCart(result.cart);
      } else {
        setCart({ items: [], totalItems: 0, totalAmount: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addItem = useCallback(async (productId, quantity = 1, variant = null) => {
    const result = await addToCart(productId, quantity, variant);
    
    if (result.success) {
      toast.success(result.message || 'Product added to cart!');
      await fetchCart(); // Refresh cart
      return true;
    } else {
      toast.error(result.error || 'Failed to add product to cart');
      return false;
    }
  }, [fetchCart]);

  // Update item quantity
  const updateItem = useCallback(async (itemId, quantity) => {
    if (quantity < 1) {
      return removeItem(itemId);
    }

    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }));
      const result = await updateCartItem(itemId, quantity);
      
      if (result.success) {
        setCart(result.cart);
        toast.success(result.message || 'Cart updated');
        return true;
      } else {
        toast.error(result.error || 'Failed to update cart');
        return false;
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Error updating cart');
      return false;
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  }, []);

  // Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    try {
      setUpdating(prev => ({ ...prev, [itemId]: true }));
      const result = await removeCartItem(itemId);
      
      if (result.success) {
        setCart(result.cart || { items: [], totalItems: 0, totalAmount: 0 });
        toast.success(result.message || 'Item removed from cart');
        return true;
      } else {
        toast.error(result.error || 'Failed to remove item');
        return false;
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error removing item');
      return false;
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    updating,
    addItem,
    updateItem,
    removeItem,
    refreshCart: fetchCart,
    isEmpty: !cart || !cart.items || cart.items.length === 0
  };
}

