/**
 * Validation utilities
 * Common validation functions
 */

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {string} id - String to validate
 * @returns {boolean}
 */
export function isValidObjectId(id) {
  return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

