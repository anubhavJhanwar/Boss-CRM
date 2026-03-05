# Firebase Migration Setup Checklist

Use this checklist to ensure you complete all steps correctly.

## 📋 Pre-Migration Checklist

- [ ] Backup existing MongoDB data (if any)
- [ ] Have a Google account ready
- [ ] Have Gmail 2FA enabled
- [ ] Have Gmail App Password generated

## 🔥 Firebase Setup

### Create Firebase Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project"
- [ ] Enter project name: `subscription-crm`
- [ ] Disable Google Analytics (optional)
- [ ] Click "Create project"
- [ ] Wait for project creation to complete

### Enable Authentication
- [ ] Click "Authentication" in sidebar
- [ ] Click "Get started"
- [ ] Click "Email/Password" under Sign-in method
- [ ] Toggle "Email/Password" to enabled
- [ ] Click "Save"

### Create Firestore Database
- [ ] Click "Firestore Database" in sidebar
- [ ] Click "Create database"
- [ ] Select "Start in production mode"
- [ ] Choose location (closest to you)
- [ ] Click "Enable"
- [ ] Wait for database creation

### Set Security Rules
- [ ] Click "Rules" tab in Firestore
- [ ] Copy rules from FIREBASE_SETUP_GUIDE.md
- [ ] Paste into rules editor
- [ ] Click "Publish"
- [ ] Verify rules are published

### Get Web App Config
- [ ] Click gear icon ⚙️ next to "Project Overview"
- [ ] Click "Project settings"
- [ ] Scroll to "Your apps"
- [ ] Click Web icon `</>`
- [ ] Enter app nickname: `Subscription CRM Web`
- [ ] Don't check Firebase Hosting
- [ ] Click "Register app"
- [ ] Copy the firebaseConfig object
- [ ] Save it somewhere safe

### Get Service Account Key
- [ ] In Project Settings, click "Service accounts" tab
- [ ] Click "Generate new private key"
- [ ] Click "Generate key"
- [ ] JSON file downloads
- [ ] Rename to `firebase-service-account.json`
- [ ] Move to `backend/` folder
- [ ] Verify file is in `.gitignore`

## 💻 Backend Configuration

### Install Dependencies
- [ ] Open terminal in `backend/` folder
- [ ] Run `npm install`
- [ ] Wait for installation to complete
- [ ] Verify `firebase-admin` is installed

### Configure Environment
- [ ] Open `backend/.env`
- [ ] Update `FIREBASE_PROJECT_ID`
- [ ] Update `FIREBASE_API_KEY`
- [ ] Update `FIREBASE_AUTH_DOMAIN`
- [ ] Update `FIREBASE_STORAGE_BUCKET`
- [ ] Update `FIREBASE_MESSAGING_SENDER_ID`
- [ ] Update `FIREBASE_APP_ID`
- [ ] Verify `ADMIN_EMAIL` is correct
- [ ] Verify `EMAIL_USER` is correct
- [ ] Verify `EMAIL_PASSWORD` is correct (App Password)
- [ ] Save file

### Verify Service Account
- [ ] Check `firebase-service-account.json` exists in `backend/`
- [ ] Open file and verify it's valid JSON
- [ ] Check it has `project_id`, `private_key`, `client_email`

## 📱 Mobile Configuration

### Install Dependencies
- [ ] Open terminal in `mobile/` folder
- [ ] Run `npm install`
- [ ] Wait for installation to complete
- [ ] Verify `firebase` package is installed

### Configure Firebase
- [ ] Open `mobile/config/firebase.ts`
- [ ] Replace `YOUR_API_KEY` with your API key
- [ ] Replace `YOUR_PROJECT_ID` with your project ID (3 places)
- [ ] Replace `YOUR_MESSAGING_SENDER_ID` with your sender ID
- [ ] Replace `YOUR_APP_ID` with your app ID
- [ ] Save file

### Verify API URL
- [ ] Open `mobile/constants/config.ts`
- [ ] Verify `API_BASE_URL` is `http://localhost:5000/api`
- [ ] For Android emulator, use `http://10.0.2.2:5000/api`
- [ ] For physical device, use your computer's IP

## 🚀 Testing

### Start Backend
- [ ] Open terminal in `backend/`
- [ ] Run `npm start`
- [ ] Check for "Server running on port 5000"
- [ ] Check for "Database: Firebase Firestore"
- [ ] No errors in console

### Test Health Endpoint
- [ ] Open browser
- [ ] Go to `http://localhost:5000/health`
- [ ] Should see `"success": true`
- [ ] Should see `"database": { "status": "connected" }`

### Start Mobile App
- [ ] Open terminal in `mobile/`
- [ ] Run `npm start`
- [ ] Wait for Metro bundler to start
- [ ] Press `w` for web
- [ ] Browser opens with app

### Test Signup
- [ ] Click "Sign Up" button
- [ ] Enter name, email, password
- [ ] Click "Sign Up"
- [ ] Should see success message
- [ ] Check email for credentials
- [ ] No errors in console

### Test Login
- [ ] Enter email and password
- [ ] Click "Login"
- [ ] Should redirect to Dashboard
- [ ] Should see user name in menu
- [ ] No errors in console

### Test Client Creation
- [ ] Click hamburger menu (☰)
- [ ] Click "Add Client"
- [ ] Fill in client details
- [ ] Click "Add Client"
- [ ] Should see success message
- [ ] Should redirect to clients list
- [ ] Client should appear in list

### Test Dashboard
- [ ] Click hamburger menu
- [ ] Click "Dashboard"
- [ ] Should see statistics
- [ ] Active clients count should be 1
- [ ] Revenue should show amount

### Test Email Reminder
- [ ] Open browser
- [ ] Go to `http://localhost:5000/test-reminder`
- [ ] Should see success message
- [ ] Check email inbox
- [ ] Should receive reminder email

## 🔍 Verification

### Firebase Console
- [ ] Open Firebase Console
- [ ] Go to Authentication
- [ ] Should see your user account
- [ ] Go to Firestore
- [ ] Should see `users` collection with 1 document
- [ ] Should see `clients` collection with 1 document

### Data Privacy
- [ ] Create second user account
- [ ] Login with second account
- [ ] Dashboard should show 0 clients
- [ ] First user's clients should NOT be visible
- [ ] Logout and login with first account
- [ ] First user's client should be visible

## 🎉 Migration Complete!

If all checkboxes are checked, your migration is complete!

## 📝 Optional: Migrate Existing Data

If you have existing MongoDB data:

- [ ] Ensure MongoDB is still accessible
- [ ] Open terminal in `backend/`
- [ ] Run `node migrate-to-firebase.js`
- [ ] Wait for migration to complete
- [ ] Check Firebase Console for migrated data
- [ ] Verify all users migrated
- [ ] Verify all clients migrated
- [ ] Test login with existing user
- [ ] Test viewing existing clients

## 🗑️ Cleanup (After Successful Migration)

- [ ] Stop MongoDB service (if running locally)
- [ ] Remove MongoDB connection string from `.env`
- [ ] Remove `mongoose` from `package.json` (optional)
- [ ] Remove old MongoDB models (optional, keep for reference)
- [ ] Update documentation
- [ ] Commit changes to Git

## 🆘 Troubleshooting

If you encounter issues, check:

1. **Firebase Console** - Check for error logs
2. **Backend Console** - Check for error messages
3. **Mobile Console** - Check for error messages
4. **Network Tab** - Check API requests/responses
5. **Firestore Rules** - Verify they're set correctly
6. **Environment Variables** - Verify all are set
7. **Service Account** - Verify file exists and is valid

## 📚 Documentation

- [README.md](./README.md) - Full documentation
- [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) - Detailed Firebase guide
- [QUICK_START.md](./QUICK_START.md) - Quick setup guide

## ✅ Success Criteria

Your migration is successful when:

- ✅ Backend starts without errors
- ✅ Mobile app loads without errors
- ✅ Can signup new users
- ✅ Can login with credentials
- ✅ Can create clients
- ✅ Can view clients
- ✅ Can edit clients
- ✅ Can delete clients
- ✅ Dashboard shows correct stats
- ✅ Email reminders work
- ✅ Data is isolated per user
- ✅ No MongoDB dependencies remain

Congratulations! You've successfully migrated to Firebase! 🎊
