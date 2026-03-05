const cron = require('node-cron');
const { db } = require('../config/firebase');
const { calculateDaysRemaining, determineStatus } = require('../utils/dateCalculations');
const { sendExpiryNotification } = require('../services/emailService');

/**
 * Cron Job: Update Expired Clients (Firebase)
 * Runs daily at midnight (00:00)
 * Updates client statuses and sends email notifications
 */
const startExpiryCheckCron = () => {
  // Schedule: Every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('🕐 Running daily expiry check (Firebase)...');
    
    try {
      // Get all clients from Firestore
      const snapshot = await db.collection('clients').get();
      let updatedCount = 0;
      let notificationsSent = 0;

      const batch = db.batch();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const doc of snapshot.docs) {
        const client = doc.data();
        const daysRemaining = calculateDaysRemaining(new Date(client.endDate));
        const newStatus = determineStatus(daysRemaining);
        const oldStatus = client.status;

        // Update status if changed
        if (newStatus !== oldStatus) {
          batch.update(doc.ref, { status: newStatus });
          updatedCount++;

          // Send email notification if newly expired
          if (newStatus === 'Expired' && oldStatus !== 'Expired') {
            // Check if notification was already sent today
            const lastNotificationSent = client.lastNotificationSent 
              ? new Date(client.lastNotificationSent) 
              : null;
            
            if (!lastNotificationSent || lastNotificationSent < today) {
              // Get user's email
              const userDoc = await db.collection('users').doc(client.userId).get();
              if (userDoc.exists) {
                const userData = userDoc.data();
                const clientWithId = { id: doc.id, ...client };
                const emailSent = await sendExpiryNotification(clientWithId, userData.email);
                if (emailSent) {
                  batch.update(doc.ref, { lastNotificationSent: new Date().toISOString() });
                  notificationsSent++;
                }
              }
            }
          }
        }
      }

      // Commit all updates
      await batch.commit();

      console.log(`✅ Expiry check complete. Updated: ${updatedCount}, Notifications sent: ${notificationsSent}`);
    } catch (error) {
      console.error('❌ Error in expiry check cron:', error);
    }
  });

  console.log('✅ Expiry check cron job scheduled (daily at midnight)');
};

module.exports = startExpiryCheckCron;
