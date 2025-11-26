// Simple in-memory rate limiter
// For production, use Redis or a dedicated rate limiting service

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now - data.firstRequest > data.windowMs) {
        this.requests.delete(key);
      }
    }
  }

  // Check if request is allowed
  isAllowed(identifier, windowMs = 60000, maxRequests = 100) {
    const now = Date.now();
    const key = identifier;

    if (!this.requests.has(key)) {
      this.requests.set(key, {
        count: 1,
        firstRequest: now,
        windowMs,
      });
      return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    const data = this.requests.get(key);
    
    // Reset window if expired
    if (now - data.firstRequest > windowMs) {
      this.requests.set(key, {
        count: 1,
        firstRequest: now,
        windowMs,
      });
      return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    // Check if limit exceeded
    if (data.count >= maxRequests) {
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: data.firstRequest + windowMs,
        retryAfter: Math.ceil((data.firstRequest + windowMs - now) / 1000)
      };
    }

    // Increment counter
    data.count++;
    return { 
      allowed: true, 
      remaining: maxRequests - data.count, 
      resetTime: data.firstRequest + windowMs 
    };
  }

  // Destroy the rate limiter
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Rate limiting configurations
export const rateLimits = {
  // General API limits
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
  },
  
  // Auth endpoints (stricter)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  
  // Registration (very strict)
  registration: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  },
  
  // Password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
  },
  
  // Email verification
  emailVerification: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
  },
  
  // Admin operations
  admin: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  
  // File uploads
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  },
};

// Get client identifier
function getClientIdentifier(request) {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  let ip = forwarded?.split(',')[0]?.trim() || 
          realIp || 
          cfConnectingIp || 
          'unknown';
  
  // For development, use a default IP
  if (ip === 'unknown' && process.env.NODE_ENV === 'development') {
    ip = '127.0.0.1';
  }
  
  return ip;
}

// Rate limiting middleware
export function rateLimit(config = rateLimits.general) {
  return (handler) => {
    return async (request, context) => {
      const identifier = getClientIdentifier(request);
      const result = rateLimiter.isAllowed(identifier, config.windowMs, config.maxRequests);
      
      if (!result.allowed) {
        return Response.json({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: result.retryAfter,
        }, {
          status: 429,
          headers: {
            'Retry-After': result.retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
          },
        });
      }
      
      // Add rate limit headers to successful responses
      const response = await handler(request, context);
      
      if (response && response.headers) {
        response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
      }
      
      return response;
    };
  };
}

// Specific rate limiters
export const rateLimiters = {
  general: rateLimit(rateLimits.general),
  auth: rateLimit(rateLimits.auth),
  registration: rateLimit(rateLimits.registration),
  passwordReset: rateLimit(rateLimits.passwordReset),
  emailVerification: rateLimit(rateLimits.emailVerification),
  admin: rateLimit(rateLimits.admin),
  upload: rateLimit(rateLimits.upload),
};

// Cleanup function for graceful shutdown
export function cleanupRateLimiter() {
  rateLimiter.destroy();
}

