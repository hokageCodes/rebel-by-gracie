import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return Response.json(
        { 
          error: 'Email not verified. Please verify your email before logging in.',
          requiresVerification: true,
          email: user.email
        },
        { status: 401 }
      );
    }

    // Set authentication cookie
    await setAuthCookie(user);

    // Return user without password
    return Response.json({
      message: 'Login successful',
      user: user.toJSON(),
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
