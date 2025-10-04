// /lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT, 10),
  secure: true, // Gmail requires SSL/TLS on port 465
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({
    from: `"Semilia" <${process.env.EMAIL_SERVER_USER}>`,
    to,
    subject,
    text,
    html,
  });
  console.log('Email sent:', info);

  return info;
};
