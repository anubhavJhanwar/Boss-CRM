require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./config/firebase');
const errorHandler = require('./middleware/errorHandler');
const startExpiryCheckCron = require('./cron/updateExpiredClients');
const startReminderCron = require('./cron/sendExpiryReminders');

// Import routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test Firestore connection
    await db.collection('_health').doc('test').set({ timestamp: new Date().toISOString() });
    
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        type: 'Firebase Firestore',
        connected: true
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Server running but database unavailable',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        type: 'Firebase Firestore',
        connected: false,
        error: error.message
      }
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Boss Tracker API (Firebase)',
    version: '2.0.0',
    database: 'Firebase Firestore'
  });
});

// Test reminder endpoint - sends test email immediately
app.get('/test-reminder', async (req, res) => {
  try {
    const { sendExpiryReminder } = require('./services/reminderService');
    const { calculateDaysRemaining } = require('./utils/dateCalculations');
    
    // Get all clients from Firestore
    const snapshot = await db.collection('clients').limit(10).get();
    
    let testClient = null;
    let clientsWithDaysRemaining = [];
    
    if (!snapshot.empty) {
      // If clients exist, find one with 3 days remaining or use first
      for (const doc of snapshot.docs) {
        const client = doc.data();
        const daysRemaining = calculateDaysRemaining(new Date(client.endDate));
        clientsWithDaysRemaining.push({
          name: client.name,
          daysRemaining: daysRemaining
        });
        
        if (daysRemaining === 3) {
          testClient = { id: doc.id, ...client, daysRemaining };
          break;
        }
      }
      
      if (!testClient) {
        const firstDoc = snapshot.docs[0];
        const firstClient = firstDoc.data();
        testClient = { 
          id: firstDoc.id, 
          ...firstClient,
          daysRemaining: calculateDaysRemaining(new Date(firstClient.endDate))
        };
      }
    } else {
      // No clients in database - create a dummy client object for testing
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 3); // 3 days from now
      
      testClient = {
        id: 'test-client',
        name: 'Test Client (Demo)',
        phoneNumber: '9876543210',
        paymentMode: 'Online',
        amountPaid: 5000,
        endDate: endDate.toISOString(),
        daysRemaining: 3
      };
      
      console.log('⚠️  No clients in database. Using dummy client for email test.');
    }
    
    // Send test reminder
    const emailSent = await sendExpiryReminder(testClient);
    
    if (emailSent) {
      res.json({
        success: true,
        message: 'Test reminder email sent successfully! Check your inbox at: ' + process.env.ADMIN_EMAIL,
        client: {
          name: testClient.name,
          endDate: testClient.endDate,
          daysRemaining: testClient.daysRemaining
        },
        emailSentTo: process.env.ADMIN_EMAIL,
        allClients: clientsWithDaysRemaining.length > 0 ? clientsWithDaysRemaining : 'No clients in database'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test reminder. Check email configuration and server logs.',
        allClients: clientsWithDaysRemaining.length > 0 ? clientsWithDaysRemaining : 'No clients in database'
      });
    }
  } catch (error) {
    console.error('Test reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test reminder',
      error: error.message
    });
  }
});

// Error handler (must be last)
app.use(errorHandler);

// Start cron jobs
startExpiryCheckCron();
startReminderCron();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔥 Database: Firebase Firestore`);
});
