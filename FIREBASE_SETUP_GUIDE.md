# Firebase Setup Guide

This guide will help you set up Firebase for your Subscription CRM application.

## Prerequisites
- A Google account
- Node.js installed on your system

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "subscription-crm")
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Enable Firebase Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" under Sign-in method
4. Enable "Email/Password"
5. Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode" (we'll set rules later)
4. Choose a location closest to your users
5. Click "Enable"

## Step 4: Set Firestore Security Rules

1. In Firestore Database, click on "Rules" tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Clients collection - only authenticated users can access their own clients
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
    }
    
    // Health check collection - allow server to write
    match /_health/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Firebase Web App Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the Web icon `</>`
5. Register your app with a nickname (e.g., "Subscription CRM Web")
6. Don't check "Firebase Hosting"
7. Click "Register app"
8. Copy the `firebaseConfig` object

## Step 6: Configure Mobile App

1. Open `mobile/config/firebase.ts`
2. Replace the placeholder values with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 7: Get Firebase Admin SDK Service Account

1. In Firebase Console, go to Project Settings (gear icon)
2. Click on "Service accounts" tab
3. Click "Generate new private key"
4. Click "Generate key" - a JSON file will download
5. Rename the file to `firebase-service-account.json`
6. Move it to the `backend/` folder
7. **IMPORTANT**: Add this file to `.gitignore` (already done)

## Step 8: Configure Backend Environment

1. Open `backend/.env`
2. Update the Firebase configuration:

```env
# Firebase Project Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

## Step 9: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Mobile
```bash
cd mobile
npm install
```

## Step 10: Start the Application

### Backend
```bash
cd backend
npm start
```

The server should start on http://localhost:5000

### Mobile
```bash
cd mobile
npm start
```

Then press:
- `w` for web
- `a` for Android
- `i` for iOS

## Step 11: Test the Setup

1. Open the mobile app
2. Click "Sign Up"
3. Create a new account
4. Check your email for credentials
5. Login with the credentials
6. Try creating a client

## Firestore Data Structure

Your Firestore database will have these collections:

### `users` Collection
```
users/{userId}
  - uid: string
  - name: string
  - email: string
  - password: string (hashed)
  - createdAt: timestamp
```

### `clients` Collection
```
clients/{clientId}
  - userId: string (reference to user)
  - name: string
  - phoneNumber: string
  - paymentMode: string
  - amountPaid: number
  - subscriptionMonths: number
  - startDate: timestamp
  - endDate: timestamp
  - status: string
  - notes: string
  - createdAt: timestamp
  - lastNotificationSent: timestamp
  - lastReminderSent: timestamp
```

## Troubleshooting

### "Firebase service account not found"
- Make sure `firebase-service-account.json` is in the `backend/` folder
- Check that the file is valid JSON
- Verify the file name is exactly `firebase-service-account.json`

### "Permission denied" errors in Firestore
- Check your Firestore security rules
- Make sure you're authenticated
- Verify the userId matches in the client data

### "Network error" on mobile
- Check that backend is running on http://localhost:5000
- Update `mobile/constants/config.ts` if using different URL
- For Android emulator, use `http://10.0.2.2:5000`
- For physical device, use your computer's IP address

### Email not sending
- Verify Gmail app password is correct
- Check that 2-factor authentication is enabled on Gmail
- Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env

## Free Tier Limits (Spark Plan)

Firebase Free Tier includes:
- **Authentication**: Unlimited users
- **Firestore**: 
  - 1 GB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
- **Cloud Functions**: Not available on free tier (cron jobs run on your server)

This is more than enough for a single-user CRM managing hundreds of clients.

## Security Best Practices

1. Never commit `firebase-service-account.json` to Git
2. Keep your `.env` file secure
3. Use environment variables for sensitive data
4. Regularly rotate your Gmail app password
5. Monitor Firebase usage in the console
6. Set up billing alerts if you upgrade to paid plan

## Next Steps

- Set up automated backups for Firestore
- Configure Firebase Cloud Messaging for push notifications
- Add Firebase Analytics for usage tracking
- Set up Firebase Performance Monitoring

## Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Check backend server logs
3. Check mobile app console logs
4. Verify all configuration values are correct
5. Ensure all dependencies are installed
