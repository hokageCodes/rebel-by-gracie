// /lib/email.js
import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Check if we're in development mode without email credentials
  if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER) {
    console.log('📧 Email service not configured - running in development mode');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT, 10),
    secure: process.env.EMAIL_SERVER_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 10000,     // 10 seconds
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    // If no transporter (development mode), just log and return success
    if (!transporter) {
      console.log('📧 [DEV MODE] Email would be sent to:', to);
      console.log('📧 [DEV MODE] Subject:', subject);
      return { messageId: 'dev-mode-' + Date.now() };
    }

    // Test the connection first
    await transporter.verify();
    console.log('📧 Email server connection verified');

    const info = await transporter.sendMail({
      from: `"RebelByGrace" <${process.env.EMAIL_SERVER_USER}>`,
      to,
      subject,
      text,
      html,
    });
    
    console.log('📧 Email sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    // In development, don't fail registration if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 [DEV MODE] Email failed but continuing in development mode');
      return { messageId: 'dev-mode-failed-' + Date.now() };
    }
    
    throw error;
  }
};
