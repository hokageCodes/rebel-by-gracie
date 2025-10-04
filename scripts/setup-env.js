import fs from 'fs';
import path from 'path';

const envTemplate = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rebel-by-grace

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-rebellion-auth-token-2024
JWT_EXPIRES_IN=7d

# Email Server Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_SECURE=false
EMAIL_SERVER_USER=hokagecreativelabs001@gmail.com
EMAIL_SERVER_PASSWORD=acjw kebc xyff ndvg

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
`;

const envExample = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rebel-by-grace

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Email Server Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_SECURE=false
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
`;

async function setupEnvironment() {
  console.log('🔧 Setting up environment configuration...\n');

  const envPath = '.env';
  const envExamplePath = '.env.example';

  try {
    // Check if .env already exists
    if (fs.existsSync(envPath)) {
      console.log('⚠️  .env file already exists');
      console.log('📋 Current EMAIL_SERVER_USER:', process.env.EMAIL_SERVER_USER || 'Not set');
      console.log('📋 Current EMAIL_SERVER_HOST:', process.env.EMAIL_SERVER_HOST || 'Not set');
      console.log('💡 If you want to update it, delete .env and run this again\n');
    } else {
      // Create .env file
      fs.writeFileSync(envPath, envTemplate);
      console.log('✅ Created .env file with provided SMTP configuration\n');
    }

    // Create .env.example (always update)
    fs.writeFileSync(envExamplePath, envExample);
    console.log('✅ Created .env.example file\n');

    console.log('📧 Email configuration:');
    console.log(`   Host: smtp.gmail.com`);
    console.log(`   Port: 587`);
    console.log(`   User: hokagecreativelabs001@gmail.com`);
    console.log(`   Secure: false (using STARTTLS)\n`);

    console.log('🚀 Next steps:');
    console.log('1. Run: node scripts/test-email.js');
    console.log('2. Check if emails are received');
    console.log('3. Start your Next.js app: npm run dev\n');

  } catch (error) {
    console.error('❌ Error setting up environment:', error.message);
    process.exit(1);
  }
}

setupEnvironment();
