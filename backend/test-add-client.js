require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('./models/Client');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Create a test client with 3 days remaining
const createTestClient = async () => {
  try {
    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3); // 3 days from now

    const testClient = new Client({
      name: 'Test Client for Reminder',
      phoneNumber: '9876543210',
      paymentMode: 'Online',
      amountPaid: 5000,
      subscriptionMonths: 1,
      startDate: startDate,
      endDate: endDate,
      status: 'Expiring Soon',
      notes: 'Test client created for reminder email testing'
    });

    await testClient.save();
    console.log('✅ Test client created successfully!');
    console.log('Client Details:', {
      name: testClient.name,
      endDate: testClient.endDate,
      daysRemaining: Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test client:', error);
    process.exit(1);
  }
};

createTestClient();
