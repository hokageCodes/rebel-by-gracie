import dotenv from 'dotenv';
import { sendEmail } from '../lib/email.js';

// Load environment variables
dotenv.config();

async function testEmailConfiguration() {
  console.log('🧪 Testing email configuration...\n');

  // Check environment variables
  console.log('📋 Environment variables:');
  console.log('EMAIL_SERVER_HOST:', process.env.EMAIL_SERVER_HOST || 'Not set');
  console.log('EMAIL_SERVER_PORT:', process.env.EMAIL_SERVER_PORT || 'Not set');
  console.log('EMAIL_SERVER_USER:', process.env.EMAIL_SERVER_USER || 'Not set');
  console.log('EMAIL_SERVER_PASSWORD:', process.env.EMAIL_SERVER_PASSWORD ? '***set***' : 'Not set');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

  // Test 1: Send test verification email
  console.log('\n📧 Sending test verification email...');
  try {
    const testEmail = process.env.EMAIL_SERVER_USER || 'test@example.com'; // Use your email or replace with test email
    const testCode = '123456';
    const testName = 'Test User';
    
    const result = await sendEmail({
      to: testEmail,
      subject: 'Test Email - RebelByGrace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${testName}!</h2>
          <p>This is a test email to verify your email configuration.</p>
          <p>If you received this email, your SMTP settings are working correctly!</p>
          <h1 style="color: #dc2626; font-size: 2em;">Test Code: ${testCode}</h1>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: `Hi ${testName}! This is a test email. Test Code: ${testCode}`
    });
    
    console.log('✅ Test verification email sent successfully!');
    console.log(`📧 Sent to: ${testEmail}`);
    console.log(`📧 Message ID: ${result.messageId}`);
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
    
    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env file has correct EMAIL_SERVER_* variables');
    console.log('2. For Gmail, use an App Password instead of your regular password');
    console.log('3. Make sure 2FA is enabled on your email account');
    console.log('4. Try using port 587 instead of 465');
    console.log('5. Check if your ISP is blocking SMTP ports');
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmailConfiguration();
}

export default testEmailConfiguration;
