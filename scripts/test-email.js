import dotenv from 'dotenv';
import { sendVerificationEmail, verifyEmailConfig } from '../lib/email.js';

// Load environment variables
dotenv.config();

async function testEmailConfiguration() {
  console.log('🧪 Testing email configuration...\n');

  // Test 1: Verify SMTP connection
  console.log('1️⃣ Testing SMTP connection...');
  const connectionOk = await verifyEmailConfig();
  
  if (!connectionOk) {
    console.log('❌ Email configuration test failed. Please check your .env file.');
    return;
  }

  // Test 2: Send test verification email
  console.log('\n2️⃣ Sending test verification email...');
  try {
    const testEmail = 'test@example.com'; // Replace with your email
    const testCode = '123456';
    const testName = 'Test User';
    
    await sendVerificationEmail(testEmail, testCode, testName);
    console.log('✅ Test verification email sent successfully!');
    console.log(`📧 Sent to: ${testEmail}`);
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmailConfiguration();
}

export default testEmailConfiguration;
