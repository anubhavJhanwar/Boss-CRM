const cron = require('node-cron');
const Client = require('../models/Client');
const { calculateDaysRemaining, determineStatus } = require('../utils/dateCalculations');
const { sendExpiryNotification } = require('../services/emailService');

/**
 * Cron Job: Update Expired Clients
 * Runs daily at midnight (00:00)
 * Updates client statuses and sends email notifications
 */
const startExpiryCheckCron = () => {
  // Schedule: Every day at midnight (00:00)
  // Format: second minute hour day month weekday
  cron.schedule('0 0 * * *', async () => {
    console.log('🕐 Running daily expiry check...');
    
    try {
      // Get all clients
      const clients = await Client.find({});
      let updatedCount = 0;
      let notificationsSent = 0;

      for (const client of clients) {
        const daysRemaining = calculateDaysRemaining(client.endDate);
        const newStatus = determineStatus(daysRemaining);
        const oldStatus = client.status;

        // Update status if changed
        if (newStatus !== oldStatus) {
          client.status = newStatus;
          await client.save();
          updatedCount++;

          // Send email notification if newly expired
          if (newStatus === 'Expired' && oldStatus !== 'Expired') {
            // Check if notification was already sent today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (!client.lastNotificationSent || new Date(client.lastNotificationSent) < today) {
              const emailSent = await sendExpiryNotification(client);
              if (emailSent) {
                client.lastNotificationSent = new Date();
                await client.save();
                notificationsSent++;
              }
            }
          }
        }
      }

      console.log(`✅ Expiry check complete. Updated: ${updatedCount}, Notifications sent: ${notificationsSent}`);
    } catch (error) {
      console.error('❌ Error in expiry check cron:', error);
    }
  });

  console.log('✅ Expiry check cron job scheduled (daily at midnight)');
};

module.exports = startExpiryCheckCron;
