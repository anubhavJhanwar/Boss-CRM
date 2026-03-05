const nodemailer = require('nodemailer');

/**
 * Email Configuration
 * Creates and exports nodemailer transporter for sending emails
 */
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

module.exports = createEmailTransporter;
