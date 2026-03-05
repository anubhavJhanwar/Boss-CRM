const nodemailer = require('nodemailer');

/**
 * Reminder Service
 * Handles sending reminder emails for subscriptions expiring soon
 * Separate from the expiry notification service
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send reminder email 3 days before expiry
 * @param {Object} client - Client object with subscription details
 * @param {string} userEmail - Email of the user who owns this client
 */
const sendExpiryReminder = async (client, userEmail) => {
  try {
    const transporter = createTransporter();

    const daysRemaining = client.daysRemaining || 0;
    const expiryDate = new Date(client.endDate).toLocaleDateString();

    const mailOptions = {
      from: `"Boss Tracker" <${process.env.EMAIL_USER}>`,
      to: userEmail, // Send to user's email instead of admin email
      subject: '⚠️ Subscription Expiring Soon - Renewal Reminder',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #f59e0b; margin-bottom: 20px;">⚠️ Subscription Expiring Soon</h2>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">
                A client's subscription will expire in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}
              </p>
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
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #f59e0b; font-weight: bold;">${expiryDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Days Remaining:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #f59e0b; font-weight: bold;">${daysRemaining}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Payment Mode:</strong></td>
                <td style="padding: 10px;">${client.paymentMode}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background-color: #f0fdf4; border-radius: 5px; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">💡 Action Required</h3>
              <p style="color: #065f46; margin: 0;">
                Consider contacting this client to discuss subscription renewal and ensure uninterrupted service.
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p>This is an automated reminder from your Boss Tracker system.</p>
              <p style="margin: 0;">Reminders are sent 3 days before subscription expiry.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Expiry reminder sent to ${userEmail} for client: ${client.name} (${daysRemaining} days remaining)`);
    return true;
  } catch (error) {
    console.error('❌ Error sending reminder email:', error);
    return false;
  }
};

module.exports = {
  sendExpiryReminder
};
