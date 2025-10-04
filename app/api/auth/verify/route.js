import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    await connectDB();

    const { email, verificationCode } = await request.json();

    if (!email || !verificationCode) {
      return Response.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      verificationCode,
      verificationCodeExpiry: { $gt: new Date() }, // code not expired
    });

    if (!user) {
      return Response.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    return Response.json(
      { message: 'Email verified successfully', user: user.toJSON() },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
