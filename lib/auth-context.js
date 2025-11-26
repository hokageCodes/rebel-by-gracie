'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    
    // Check auth status periodically (every 30 seconds)
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 30000);

    // Listen for storage events (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'auth-state' || e.key === null) {
        checkAuthStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(prevUser => {
          // Only update if user actually changed
          if (JSON.stringify(prevUser) !== JSON.stringify(data.user)) {
            return data.user;
          }
          return prevUser;
        });
      } else if (response.status === 401) {
        // Token expired or invalid
        setUser(prevUser => {
          if (prevUser !== null) {
            // Only dispatch event if user was logged in
            window.dispatchEvent(new Event('auth-state-changed'));
          }
          return null;
        });
        // Clear any stale auth data
        await fetch('/api/auth/logout', { method: 'POST' });
      } else {
        setUser(prevUser => {
          if (prevUser !== null) {
            window.dispatchEvent(new Event('auth-state-changed'));
          }
          return null;
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(prevUser => {
        if (prevUser !== null) {
          window.dispatchEvent(new Event('auth-state-changed'));
        }
        return null;
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        // Trigger auth state change event
        window.dispatchEvent(new Event('auth-state-changed'));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error, requiresVerification: data.requiresVerification };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message, email: data.email };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const verifyEmail = async (email, verificationCode) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        // Trigger auth state change event
        window.dispatchEvent(new Event('auth-state-changed'));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      // Trigger auth state change event
      window.dispatchEvent(new Event('auth-state-changed'));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyEmail,
    resendVerification,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
