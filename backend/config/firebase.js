const admin = require('firebase-admin');
const path = require('path');

/**
 * Firebase Admin SDK Configuration
 * Initializes Firebase Admin for backend operations
 */

let firebaseApp;

const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Try to load service account from file
    const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
    
    try {
      const serviceAccount = require(serviceAccountPath);
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
      
      console.log('✅ Firebase Admin initialized with service account file');
    } catch (fileError) {
      // If file doesn't exist, try environment variable
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID
        });
        
        console.log('✅ Firebase Admin initialized with environment variable');
      } else {
        throw new Error('Firebase service account not found. Please provide firebase-service-account.json or FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
      }
    }

    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }
};

// Initialize Firebase
const app = initializeFirebase();

// Export Firebase services
const auth = admin.auth();
const db = admin.firestore();

// Firestore settings
db.settings({
  ignoreUndefinedProperties: true
});

module.exports = {
  admin,
  auth,
  db,
  app
};
