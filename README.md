# Boss Tracker - Subscription Management CRM

A complete full-stack mobile application for managing stock broker client subscriptions with automated email reminders and expiry tracking.

## 🚀 Features

- **Authentication**: Firebase Authentication with email/password
- **Client Management**: Add, edit, view, and delete clients
- **Subscription Tracking**: Automatic status calculation (Active, Expiring Soon, Expired)
- **Dashboard**: Real-time statistics and insights
- **Automated Emails**: 
  - Reminder emails 3 days before expiry
  - Expiry notification emails
  - Signup confirmation emails
- **Expiring Soon**: Dedicated section for clients expiring in next 7 days
- **Modern UI**: Professional dark theme with responsive design
- **Cross-platform**: Works on Web, iOS, and Android

## 🛠️ Tech Stack

### Frontend (Mobile)
- Expo React Native
- TypeScript
- React Navigation
- Zustand (State Management)
- Firebase Auth SDK
- Axios

### Backend
- Node.js + Express
- Firebase Firestore
- Firebase Admin SDK
- Nodemailer (Gmail SMTP)
- node-cron (Scheduled Jobs)
- bcryptjs (Password Hashing)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account (free tier works)
- Gmail account with App Password enabled

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd boss-tracker
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Email/Password authentication
4. Create Firestore database (production mode)
5. Get web app config (Project Settings > General > Your apps > Web)
6. Download service account key (Project Settings > Service Accounts > Generate New Private Key)

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and fill in your credentials
# - Firebase configuration
# - Gmail SMTP credentials
# - Admin email

# Place firebase-service-account.json in backend folder
# (Downloaded from Firebase Console)

# Start the server
npm start
```

The backend will run on http://localhost:5000

### 4. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and fill in your Firebase web config

# Start Expo
npm start
```

Then press:
- `w` for web browser
- `a` for Android emulator
- `i` for iOS simulator

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Email
ADMIN_EMAIL=your-email@example.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# CORS
CORS_ORIGIN=*
```

### Mobile (.env)

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `DELETE /api/auth/delete-account` - Delete account (protected)

### Clients
- `GET /api/clients` - Get all clients (protected)
- `GET /api/clients/:id` - Get single client (protected)
- `POST /api/clients` - Create client (protected)
- `PUT /api/clients/:id` - Update client (protected)
- `DELETE /api/clients/:id` - Delete client (protected)
- `GET /api/clients/stats/dashboard` - Get dashboard stats (protected)
- `GET /api/clients/expiring-soon` - Get clients expiring in 7 days (protected)

## 🗄️ Firestore Data Structure

### users Collection
```
users/{userId}
  - uid: string
  - name: string
  - email: string
  - password: string (hashed)
  - createdAt: timestamp
```

### clients Collection
```
clients/{clientId}
  - userId: string
  - name: string
  - phoneNumber: string
  - paymentMode: "Cash" | "Online"
  - amountPaid: number
  - subscriptionMonths: number
  - startDate: timestamp
  - endDate: timestamp
  - status: "Active" | "Expiring Soon" | "Expired"
  - notes: string
  - createdAt: timestamp
  - lastNotificationSent: timestamp
  - lastReminderSent: timestamp
```

## 🔄 Automated Cron Jobs

### Daily Expiry Check (Midnight)
- Updates client statuses based on end dates
- Sends expiry notification emails to user's email
- Prevents duplicate notifications

### Daily Reminder Check (9:00 AM)
- Finds clients expiring in 3 days
- Sends reminder emails to user's email
- Prevents duplicate reminders

## 🎨 Design System

### Colors
- Background: `#0f172a` (Dark Slate)
- Cards: `#1e293b` (Slate)
- Primary: `#3b82f6` (Blue)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Danger: `#ef4444` (Red)

## 🧪 Testing

### Test Reminder Email
```bash
curl http://localhost:5000/test-reminder
```

### Test Health Check
```bash
curl http://localhost:5000/health
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Upload `firebase-service-account.json` securely (or use environment variable)
3. Deploy backend
4. Update mobile app API URL

### Mobile Deployment
1. Update `EXPO_PUBLIC_API_BASE_URL` in `.env`
2. Build with EAS Build: `eas build`
3. Submit to App Store / Play Store
4. Or deploy as web app

## 📊 Firebase Free Tier Limits

- Authentication: Unlimited users
- Firestore: 1 GB storage, 50K reads/day, 20K writes/day
- Perfect for single-user CRM with hundreds of clients

## 🔒 Security Best Practices

1. **Never commit sensitive files**:
   - `.env` files
   - `firebase-service-account.json`
   - Any files with passwords or API keys

2. **Use environment variables** for all sensitive data

3. **Enable 2FA** on Gmail and use App Passwords

4. **Set Firestore security rules** to protect data

5. **Regularly rotate** API keys and passwords

6. **Use HTTPS** in production

## 🐛 Troubleshooting

### Backend won't start
- Check Firebase service account file exists
- Verify .env configuration
- Check port 5000 is available

### Mobile app blank screen
- Verify Firebase config in .env
- Check API_BASE_URL is correct
- Clear Expo cache: `expo start -c`

### Emails not sending
- Enable 2FA on Gmail
- Generate App Password
- Verify EMAIL_USER and EMAIL_PASSWORD in .env

### Authentication errors
- Check Firebase Authentication is enabled
- Verify Firestore security rules
- Check token expiration

## 📝 Project Structure

```
boss-tracker/
├── backend/
│   ├── config/
│   │   ├── firebase.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   └── adminController.js
│   ├── cron/
│   │   ├── updateExpiredClients.js
│   │   └── sendExpiryReminders.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── reminderService.js
│   │   └── sendSignupMail.js
│   ├── utils/
│   │   └── dateCalculations.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── mobile/
│   ├── components/
│   │   ├── ClientCard.tsx
│   │   └── StatCard.tsx
│   ├── config/
│   │   └── firebase.ts
│   ├── constants/
│   │   └── config.ts
│   ├── screens/
│   │   ├── auth/
│   │   ├── clients/
│   │   ├── dashboard/
│   │   └── settings/
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── clientService.ts
│   │   └── storage.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── clientStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── .env.example
│   ├── App.tsx
│   ├── app.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🤝 Contributing

This is a private project. Not accepting contributions.

## 📄 License

Private - All Rights Reserved

## 👨‍💻 Author

Built for stock broker client subscription management.

## 🙏 Acknowledgments

- Firebase for reliable backend infrastructure
- Expo for cross-platform mobile development
- React Navigation for seamless navigation
- Nodemailer for email functionality
