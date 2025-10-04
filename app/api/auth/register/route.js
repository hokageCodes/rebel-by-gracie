import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password, firstName, lastName, phone } = await request.json();

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return Response.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Your Verification Code - Semilia',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi ${firstName}!</h2>
            <p>Your verification code is:</p>
            <h1>${verificationCode}</h1>
            <p>This code expires in 15 minutes.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('❌ Error sending verification email:', emailError.message);
      return Response.json(
        { error: 'Failed to send verification email. Try again later.' },
        { status: 500 }
      );
    }

    // Save user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone,
      verificationCode,
      verificationCodeExpiry,
      isEmailVerified: false,
    });

    await user.save();

    return Response.json(
      {
        message: 'User registered successfully. Check your email for the verification code.',
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
