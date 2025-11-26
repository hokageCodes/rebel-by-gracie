import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { sendEmail } from '@/lib/email';
import { validateData, schemas, sanitize } from '@/lib/validation';
import { asyncHandler, errors, successResponse } from '@/lib/error-handler';
import { rateLimiters } from '@/lib/rate-limiter';

// Apply rate limiting and security middleware
const handler = asyncHandler(async (request) => {
  await connectDB();

  const requestData = await request.json();
  
  // Sanitize input
  const sanitizedData = {
    email: sanitize.email(requestData.email),
    password: requestData.password, // Don't sanitize password
    firstName: sanitize.string(requestData.firstName),
    lastName: sanitize.string(requestData.lastName),
    phone: sanitize.phone(requestData.phone),
  };

  // Validate input
  const validation = validateData(sanitizedData, schemas.user);
  if (!validation.isValid) {
    throw errors.VALIDATION_ERROR('Registration failed', validation.errors);
  }

  // Check if user exists
  const existingUser = await User.findOne({ email: validation.data.email });
  if (existingUser) {
    throw errors.ALREADY_EXISTS('User', 'email');
  }

  // Generate verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  // Send verification email
  let emailSent = false;
  try {
    await sendEmail({
      to: validation.data.email,
      subject: 'Your Verification Code - RebelByGrace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${validation.data.firstName}!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #dc2626; font-size: 2em;">${verificationCode}</h1>
          <p>This code expires in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });
    emailSent = true;
    console.log('✅ Verification email sent successfully');
  } catch (emailError) {
    console.error('❌ Error sending verification email:', emailError.message);
    
    // In development mode, continue with registration even if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 [DEV MODE] Continuing registration despite email failure');
      emailSent = false;
    } else {
      throw errors.EXTERNAL_SERVICE_ERROR('Email Service', 'Failed to send verification email');
    }
  }

  // Save user
  const user = new User({
    ...validation.data,
    verificationCode,
    verificationCodeExpiry,
    isEmailVerified: false,
  });

  await user.save();

  const responseMessage = emailSent 
    ? 'User registered successfully. Check your email for the verification code.'
    : 'User registered successfully. Email verification is currently unavailable.';

  return successResponse({
    userId: user._id,
    email: user.email,
    firstName: user.firstName,
    emailSent,
    ...(process.env.NODE_ENV === 'development' && !emailSent && { 
      devVerificationCode: verificationCode,
      devMessage: 'Development mode: Use this code for verification'
    })
  }, responseMessage, 201);
});

// Export with rate limiting
export const POST = rateLimiters.registration(handler);