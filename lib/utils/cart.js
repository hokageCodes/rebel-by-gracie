/**
 * Cart utility functions
 * Centralized cart operations
 */

import { getSessionId } from './session';

const CART_UPDATED_EVENT = 'cart-updated';

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {object} variant - Optional variant object
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function addToCart(productId, quantity = 1, variant = null) {
  try {
    // Convert productId to string if it's an object (MongoDB ObjectId)
    let productIdString = productId;
    if (productId && typeof productId === 'object' && productId.toString) {
      productIdString = productId.toString();
    } else if (productId && typeof productId !== 'string') {
      productIdString = String(productId);
    }

    // Validate productId is a valid MongoDB ObjectId
    if (!productIdString || !/^[0-9a-fA-F]{24}$/.test(productIdString)) {
      return {
        success: false,
        error: 'Invalid product ID format'
      };
    }

    const sessionId = getSessionId();
    
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productIdString,
        quantity,
        variant,
        sessionId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Trigger cart count update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      }
      return {
        success: true,
        data: data.cart,
        message: 'Product added to cart!'
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to add product to cart'
      };
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      error: 'Error adding to cart'
    };
  }
}

/**
 * Get cart data
 * @returns {Promise<{success: boolean, cart?: object, error?: string}>}
 */
export async function getCart() {
  try {
    const sessionId = getSessionId();
    const response = await fetch(`/api/cart?sessionId=${sessionId}`);
    const data = await response.json();

    if (response.ok && data.cart) {
      return {
        success: true,
        cart: data.cart
      };
    } else {
      return {
        success: true,
        cart: { items: [], totalItems: 0, totalAmount: 0 }
      };
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      success: false,
      error: 'Error fetching cart',
      cart: { items: [], totalItems: 0, totalAmount: 0 }
    };
  }
}

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<{success: boolean, cart?: object, error?: string}>}
 */
export async function updateCartItem(itemId, quantity) {
  try {
    if (!quantity || quantity < 1) {
      return {
        success: false,
        error: 'Quantity must be at least 1'
      };
    }

    const sessionId = getSessionId();
    const response = await fetch(`/api/cart/${itemId}?sessionId=${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();

    if (response.ok) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      }
      return {
        success: true,
        cart: data.cart,
        message: 'Cart updated'
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to update cart'
      };
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    return {
      success: false,
      error: 'Error updating cart'
    };
  }
}

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise<{success: boolean, cart?: object, error?: string}>}
 */
export async function removeCartItem(itemId) {
  try {
    const sessionId = getSessionId();
    const response = await fetch(`/api/cart/${itemId}?sessionId=${sessionId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      }
      return {
        success: true,
        cart: data.cart || { items: [], totalItems: 0, totalAmount: 0 },
        message: 'Item removed from cart'
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to remove item'
      };
    }
  } catch (error) {
    console.error('Error removing item:', error);
    return {
      success: false,
      error: 'Error removing item'
    };
  }
}

/**
 * Get cart count
 * @returns {Promise<number>}
 */
export async function getCartCount() {
  try {
    const result = await getCart();
    return result.cart?.totalItems || 0;
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
}

