import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await connectDB();

    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return Response.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Your New Verification Code - Semilia',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hi ${user.firstName}!</h2>
            <p>Your new verification code is:</p>
            <h1>${verificationCode}</h1>
            <p>This code expires in 15 minutes.</p>
          </div>
        `
      });

      return Response.json({ message: 'New verification code sent successfully' }, { status: 200 });

    } catch (emailError) {
      console.error('❌ Error resending verification email:', emailError.message);
      return Response.json(
        { error: 'Failed to send verification email. Check email settings.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Resend verification code error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
