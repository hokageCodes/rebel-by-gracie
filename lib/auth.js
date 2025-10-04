import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(user) {
  const token = generateToken({
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return token;
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function getCurrentUser() {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    // Import User model dynamically to avoid circular dependencies
    const User = (await import('./models/User.js')).default;
    
    // Import and ensure MongoDB connection
    const connectDB = (await import('./mongodb.js')).default;
    await connectDB();
    
    const user = await User.findById(decoded.userId).select('-password');
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  };
}

export function requireAdmin(handler) {
  return async (req, res) => {
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(403).json({ error: 'Admin access required' });
    }
  };
}

export function requireVerifiedEmail(handler) {
  return async (req, res) => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.isEmailVerified) {
        return res.status(403).json({ 
          error: 'Email verification required',
          requiresVerification: true 
        });
      }
      
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(403).json({ error: 'Authentication required' });
    }
  };
}
