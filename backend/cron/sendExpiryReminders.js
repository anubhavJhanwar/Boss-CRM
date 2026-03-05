const cron = require('node-cron');
const { db } = require('../config/firebase');
const { calculateDaysRemaining } = require('../utils/dateCalculations');
const { sendExpiryReminder } = require('../services/reminderService');

/**
 * Cron Job: Send Expiry Reminders (Firebase)
 * Runs daily at 9:00 AM
 * Sends reminder emails 3 days before subscription expiry
 */
const startReminderCron = () => {
  // Schedule: Every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('📧 Running daily reminder check (3 days before expiry - Firebase)...');
    
    try {
      // Get all non-expired clients from Firestore
      const snapshot = await db.collection('clients')
        .where('status', '!=', 'Expired')
        .get();
      
      let remindersSent = 0;
      const batch = db.batch();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const doc of snapshot.docs) {
        const client = doc.data();
        const daysRemaining = calculateDaysRemaining(new Date(client.endDate));

        // Send reminder if exactly 3 days remaining
        if (daysRemaining === 3) {
          // Check if reminder was already sent today
          const lastReminderSent = client.lastReminderSent 
            ? new Date(client.lastReminderSent) 
            : null;
          
          if (!lastReminderSent || lastReminderSent < today) {
            // Get user's email
            const userDoc = await db.collection('users').doc(client.userId).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              const clientWithId = { 
                id: doc.id, 
                ...client,
                daysRemaining 
              };
              
              const emailSent = await sendExpiryReminder(clientWithId, userData.email);
              if (emailSent) {
                batch.update(doc.ref, { lastReminderSent: new Date().toISOString() });
                remindersSent++;
              }
            }
          }
        }
      }

      // Commit all updates
      await batch.commit();

      console.log(`✅ Reminder check complete. Reminders sent: ${remindersSent}`);
    } catch (error) {
      console.error('❌ Error in reminder cron:', error);
    }
  });

  console.log('✅ Reminder cron job scheduled (daily at 9:00 AM)');
};

module.exports = startReminderCron;
