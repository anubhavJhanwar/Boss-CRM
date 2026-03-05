/**
 * MongoDB to Firebase Migration Script
 * 
 * This script migrates data from MongoDB to Firebase Firestore
 * Run this ONCE after setting up Firebase
 * 
 * Usage: node migrate-to-firebase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { db } = require('./config/firebase');

// MongoDB Models
const User = require('./models/User');
const Client = require('./models/Client');

const MONGODB_URI = process.env.MONGODB_URI;

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

async function migrateUsers() {
  console.log('\n📦 Migrating Users...');
  
  try {
    const users = await User.find({});
    console.log(`Found ${users.length} users in MongoDB`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      try {
        // Check if user already exists in Firestore
        const existingUser = await db.collection('users').doc(user._id.toString()).get();
        
        if (existingUser.exists) {
          console.log(`⏭️  User already exists: ${user.email}`);
          skippedCount++;
          continue;
        }

        // Migrate user to Firestore
        const userData = {
          uid: user._id.toString(),
          name: user.name,
          email: user.email,
          password: user.password, // Already hashed
          createdAt: user.createdAt.toISOString()
        };

        await db.collection('users').doc(user._id.toString()).set(userData);
        console.log(`✅ Migrated user: ${user.email}`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrating user ${user.email}:`, error.message);
      }
    }

    console.log(`\n✅ Users migration complete: ${migratedCount} migrated, ${skippedCount} skipped`);
    return migratedCount;
  } catch (error) {
    console.error('❌ Error in user migration:', error);
    return 0;
  }
}

async function migrateClients() {
  console.log('\n📦 Migrating Clients...');
  
  try {
    const clients = await Client.find({});
    console.log(`Found ${clients.length} clients in MongoDB`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const client of clients) {
      try {
        // Check if client already exists in Firestore
        const existingClient = await db.collection('clients').doc(client._id.toString()).get();
        
        if (existingClient.exists) {
          console.log(`⏭️  Client already exists: ${client.name}`);
          skippedCount++;
          continue;
        }

        // Migrate client to Firestore
        const clientData = {
          userId: client.userId ? client.userId.toString() : null,
          name: client.name,
          phoneNumber: client.phoneNumber || '',
          paymentMode: client.paymentMode,
          amountPaid: client.amountPaid,
          subscriptionMonths: client.subscriptionMonths,
          startDate: client.startDate.toISOString(),
          manualStartDate: client.manualStartDate ? client.manualStartDate.toISOString() : null,
          endDate: client.endDate.toISOString(),
          status: client.status,
          notes: client.notes || '',
          createdAt: client.createdAt.toISOString(),
          lastNotificationSent: client.lastNotificationSent ? client.lastNotificationSent.toISOString() : null,
          lastReminderSent: client.lastReminderSent ? client.lastReminderSent.toISOString() : null
        };

        await db.collection('clients').doc(client._id.toString()).set(clientData);
        console.log(`✅ Migrated client: ${client.name}`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrating client ${client.name}:`, error.message);
      }
    }

    console.log(`\n✅ Clients migration complete: ${migratedCount} migrated, ${skippedCount} skipped`);
    return migratedCount;
  } catch (error) {
    console.error('❌ Error in client migration:', error);
    return 0;
  }
}

async function runMigration() {
  console.log('🚀 Starting MongoDB to Firebase Migration\n');
  console.log('⚠️  WARNING: Make sure Firebase is properly configured before running this script');
  console.log('⚠️  This script will copy data from MongoDB to Firebase Firestore\n');

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Migrate users
    const userCount = await migrateUsers();

    // Migrate clients
    const clientCount = await migrateClients();

    console.log('\n🎉 Migration Complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Users migrated: ${userCount}`);
    console.log(`   - Clients migrated: ${clientCount}`);
    console.log('\n✅ You can now switch to Firebase by starting the server with the new configuration');
    console.log('⚠️  Remember to update your mobile app to use Firebase authentication');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
    process.exit(0);
  }
}

// Run migration
runMigration();
