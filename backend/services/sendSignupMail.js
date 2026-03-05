const createEmailTransporter = require('../config/email');

/**
 * Send Signup Email
 * Sends welcome email with login credentials to newly registered user
 */
const sendSignupMail = async (name, email, password) => {
  try {
    const transporter = createEmailTransporter();

    const mailOptions = {
      from: `"Boss Tracker" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Boss Tracker Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #3b82f6; margin-bottom: 20px;">Welcome to Boss Tracker! 🎉</h2>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hello <strong>${name}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Your Boss Tracker account has been created successfully. You can now manage your subscription clients with ease.
            </p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 30px 0;">
              <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">Login Credentials</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Password:</td>
                  <td style="padding: 8px 0; color: #333;">${password}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⚠️ Important:</strong> Please keep these credentials safe and secure. Do not share them with anyone.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #333; margin-top: 30px;">
              You can now login to your Boss Tracker mobile app and start managing your clients.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">This is an automated email from Boss Tracker.</p>
              <p style="margin: 5px 0 0 0;">If you did not create this account, please ignore this email.</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Signup email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending signup email:', error);
    return false;
  }
};

module.exports = sendSignupMail;
