/**
 * Session management utilities
 * Centralized session ID generation and management
 */

const SESSION_ID_KEY = 'sessionId';

/**
 * Get or generate a session ID
 * @returns {string} Session ID
 */
export function getSessionId() {
  if (typeof window === 'undefined') {
    return null;
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Generate a new session ID
 * @returns {string} New session ID
 */
export function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Clear session ID
 */
export function clearSessionId() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_ID_KEY);
  }
}

