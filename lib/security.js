import crypto from 'crypto';

// Security headers configuration
export const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Strict Transport Security (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()'
  ].join(', '),
};

// CORS configuration
export const corsConfig = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-CSRF-Token',
  ],
};

// CSRF protection
class CSRFProtection {
  constructor() {
    this.tokens = new Map();
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }
  
  // Generate CSRF token
  generateToken(sessionId) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + (30 * 60 * 1000); // 30 minutes
    
    this.tokens.set(token, {
      sessionId,
      expiry,
    });
    
    return token;
  }
  
  // Verify CSRF token
  verifyToken(token, sessionId) {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData) {
      return false;
    }
    
    if (tokenData.expiry < Date.now()) {
      this.tokens.delete(token);
      return false;
    }
    
    if (tokenData.sessionId !== sessionId) {
      return false;
    }
    
    return true;
  }
  
  // Cleanup expired tokens
  cleanup() {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (data.expiry < now) {
        this.tokens.delete(token);
      }
    }
  }
  
  // Destroy the CSRF protection
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.tokens.clear();
  }
}

const csrfProtection = new CSRFProtection();

// Input sanitization
export const sanitizers = {
  // Remove potentially dangerous characters
  html: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },
  
  // Sanitize for SQL injection (though we use MongoDB)
  sql: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/['";\\]/g, '') // Remove dangerous SQL characters
      .trim();
  },
  
  // Sanitize file paths
  path: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[^a-zA-Z0-9._-]/g, '') // Only allow safe characters
      .replace(/\.\./g, '') // Remove directory traversal attempts
      .trim();
  },
  
  // Sanitize email
  email: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._-]/g, '');
  },
  
  // Sanitize phone number
  phone: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[^\d+]/g, '') // Only keep digits and +
      .trim();
  },
};

// Security middleware functions
export const securityMiddleware = {
  // Add security headers
  addSecurityHeaders: (response) => {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  },
  
  // CSRF protection for state-changing operations
  csrfProtection: (handler) => {
    return async (request, context) => {
      // Skip CSRF for GET, HEAD, OPTIONS
      if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
        return handler(request, context);
      }
      
      // Skip CSRF for API routes (they use JWT)
      if (request.url.includes('/api/')) {
        return handler(request, context);
      }
      
      const csrfToken = request.headers.get('X-CSRF-Token');
      const sessionId = request.headers.get('X-Session-ID');
      
      if (!csrfToken || !sessionId) {
        return Response.json({
          error: 'CSRF token and session ID required',
        }, { status: 403 });
      }
      
      if (!csrfProtection.verifyToken(csrfToken, sessionId)) {
        return Response.json({
          error: 'Invalid CSRF token',
        }, { status: 403 });
      }
      
      return handler(request, context);
    };
  },
  
  // Request size limiter
  requestSizeLimiter: (maxSize = 10 * 1024 * 1024) => { // 10MB default
    return (handler) => {
      return async (request, context) => {
        const contentLength = request.headers.get('content-length');
        
        if (contentLength && parseInt(contentLength) > maxSize) {
          return Response.json({
            error: 'Request too large',
            maxSize: `${maxSize / 1024 / 1024}MB`,
          }, { status: 413 });
        }
        
        return handler(request, context);
      };
    };
  },
  
  // IP whitelist/blacklist
  ipFilter: (options = {}) => {
    const { whitelist = [], blacklist = [], allowedRanges = [] } = options;
    
    return (handler) => {
      return async (request, context) => {
        const ip = getClientIP(request);
        
        // Check blacklist first
        if (blacklist.includes(ip)) {
          return Response.json({
            error: 'Access denied',
          }, { status: 403 });
        }
        
        // Check whitelist if provided
        if (whitelist.length > 0 && !whitelist.includes(ip)) {
          return Response.json({
            error: 'Access denied',
          }, { status: 403 });
        }
        
        // Check IP ranges
        if (allowedRanges.length > 0) {
          const isInRange = allowedRanges.some(range => {
            return isIPInRange(ip, range);
          });
          
          if (!isInRange) {
            return Response.json({
              error: 'Access denied',
            }, { status: 403 });
          }
        }
        
        return handler(request, context);
      };
    };
  },
  
  // Request logging
  requestLogger: (handler) => {
    return async (request, context) => {
      const start = Date.now();
      const ip = getClientIP(request);
      const userAgent = request.headers.get('user-agent');
      
      try {
        const response = await handler(request, context);
        const duration = Date.now() - start;
        
        console.log(`${request.method} ${request.url} - ${response.status} - ${duration}ms - ${ip} - ${userAgent}`);
        
        return response;
      } catch (error) {
        const duration = Date.now() - start;
        console.error(`${request.method} ${request.url} - ERROR - ${duration}ms - ${ip} - ${userAgent} - ${error.message}`);
        throw error;
      }
    };
  },
};

// Utility functions
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0]?.trim() || 
         realIp || 
         cfConnectingIp || 
         'unknown';
}

function isIPInRange(ip, range) {
  // Simple CIDR check (for production, use a proper CIDR library)
  if (range.includes('/')) {
    const [network, prefixLength] = range.split('/');
    // This is a simplified check - use a proper CIDR library in production
    return ip.startsWith(network.split('.').slice(0, Math.floor(prefixLength / 8)).join('.'));
  }
  
  return ip === range;
}

// Password security utilities
export const passwordSecurity = {
  // Check password strength
  checkStrength: (password) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    return {
      score,
      checks,
      strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
      isValid: score >= 4,
    };
  },
  
  // Generate secure random password
  generateSecurePassword: (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  },
};

// Session security
export const sessionSecurity = {
  // Generate secure session ID
  generateSessionId: () => {
    return crypto.randomBytes(32).toString('hex');
  },
  
  // Generate CSRF token for session
  generateCSRFToken: (sessionId) => {
    return csrfProtection.generateToken(sessionId);
  },
  
  // Verify CSRF token
  verifyCSRFToken: (token, sessionId) => {
    return csrfProtection.verifyToken(token, sessionId);
  },
};

// Cleanup function for graceful shutdown
export function cleanupSecurity() {
  csrfProtection.destroy();
}

