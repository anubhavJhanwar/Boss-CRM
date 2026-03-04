const nodemailer = require('nodemailer');

/**
 * Email Service
 * Handles sending email notifications for subscription expiry
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send subscription expiry notification
 * @param {Object} client - Client object with subscription details
 */
const sendExpiryNotification = async (client) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Subscription CRM" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Subscription Expired',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #dc2626; margin-bottom: 20px;">⚠️ Subscription Expired</h2>
            <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 0; color: #991b1b; font-weight: bold;">A client's subscription has expired</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Client Name:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${client.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Phone Number:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${client.phoneNumber || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Amount Paid:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">₹${client.amountPaid}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Expiry Date:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${new Date(client.endDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Payment Mode:</strong></td>
                <td style="padding: 10px;">${client.paymentMode}</td>
              </tr>
            </table>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p>This is an automated notification from your Subscription CRM system.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Expiry notification sent for client: ${client.name}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendExpiryNotification
};
