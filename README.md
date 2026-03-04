# Subscription CRM - Stock Broker Client Management

A complete production-ready mobile app for managing stock broker subscription clients with automated expiry tracking and email notifications.

## 🎯 Features

### Admin Features
- Single admin authentication with JWT
- Secure login with persistent sessions
- Dashboard with key statistics
- Client management (CRUD operations)

### Client Management
- Add/Edit/Delete clients
- Track subscription details
- Payment mode tracking (Cash/Online)
- Automatic expiry calculation
- Status tracking (Active/Expiring Soon/Expired)
- Search and filter clients
- Notes for each client

### Automation
- Daily cron job for expiry checks
- Automatic status updates
- Email notifications for expired subscriptions
- Days remaining calculation

### Dashboard Statistics
- Total active clients
- Total expired clients
- Revenue this month
- Clients expiring in next 7 days

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB Atlas (Cloud Database)
- Mongoose ODM
- JWT Authentication
- bcrypt for password hashing
- node-cron for scheduled tasks
- Nodemailer for email notifications

### Mobile App
- Expo (React Native)
- TypeScript
- React Navigation
- Zustand (State Management)
- Axios (API Communication)
- Expo SecureStore (Token Persistence)
- NativeWind (Tailwind CSS)

## 📁 Project Structure

```
subscription-crm/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── clientController.js
│   ├── models/
│   │   ├── Admin.js
│   │   └── Client.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── clientRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/
│   │   └── emailService.js
│   ├── cron/
│   │   └── updateExpiredClients.js
│   ├── utils/
│   │   ├── dateCalculations.js
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── mobile/
    ├── components/
    │   ├── ClientCard.tsx
    │   └── StatCard.tsx
    ├── constants/
    │   └── config.ts
    ├── screens/
    │   ├── auth/
    │   │   └── LoginScreen.tsx
    │   ├── dashboard/
    │   │   └── DashboardScreen.tsx
    │   ├── clients/
    │   │   ├── ClientsListScreen.tsx
    │   │   ├── AddClientScreen.tsx
    │   │   ├── EditClientScreen.tsx
    │   │   └── ClientDetailsScreen.tsx
    │   └── settings/
    │       └── SettingsScreen.tsx
    ├── services/
    │   ├── api.ts
    │   ├── authService.ts
    │   ├── clientService.ts
    │   └── storage.ts
    ├── store/
    │   ├── authStore.ts
    │   └── clientStore.ts
    ├── types/
    │   └── index.ts
    ├── App.tsx
    ├── app.json
    ├── package.json
    └── tsconfig.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Expo CLI installed
- Android Studio (for local testing)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@example.com
```

5. Start server:
```bash
npm start
```

Backend runs on `http://localhost:5000`

### Mobile App Setup

1. Navigate to mobile folder:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `constants/config.ts`:
```typescript
export const API_BASE_URL = 'http://your-backend-url/api';
```

4. Start Expo:
```bash
npx expo start
```

5. Scan QR code with Expo Go app or press 'a' for Android emulator

## 📱 App Screens

1. **Login Screen** - Admin authentication
2. **Dashboard** - Statistics and quick actions
3. **Clients List** - View all clients with filters
4. **Add Client** - Create new client subscription
5. **Edit Client** - Update client details
6. **Client Details** - View complete client information
7. **Settings** - Account info and logout

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Secure token storage with Expo SecureStore
- Protected API routes
- Single admin system (no public access)

## 📧 Email Notifications

Automated email notifications are sent when:
- Client subscription expires
- Email includes client name, amount, and expiry date
- Sent to admin email configured in environment variables

## ⏰ Cron Jobs

Daily cron job runs at midnight to:
- Check all client subscriptions
- Update expired statuses
- Send email notifications
- Calculate days remaining

## 🎨 UI/UX Features

- Clean, professional design
- Status color coding:
  - Green: Active
  - Yellow: Expiring Soon (≤5 days)
  - Red: Expired
- Smooth navigation transitions
- Pull-to-refresh functionality
- Loading states
- Error handling with alerts

## 📊 Business Logic

### Subscription Calculation
```
startDate = Current date (or manual override)
endDate = startDate + subscriptionMonths
daysRemaining = endDate - today
status = 
  if daysRemaining <= 0: "Expired"
  if daysRemaining <= 5: "Expiring Soon"
  else: "Active"
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin (first-time only)
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin

### Clients
- `GET /api/clients` - Get all clients (with filters)
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/stats/dashboard` - Get dashboard stats

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deployment Steps
1. Deploy MongoDB Atlas (Free tier)
2. Deploy backend on Render (Free tier)
3. Build mobile app with EAS
4. Configure environment variables
5. Create first admin user

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@example.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
CORS_ORIGIN=*
```

### Mobile App Configuration
Update `mobile/constants/config.ts` with your backend URL.

## 📝 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, please check:
1. Backend logs in Render dashboard
2. MongoDB Atlas connection
3. Environment variables configuration
4. API endpoint responses

## 🎯 Future Enhancements

- Multi-admin support
- SMS notifications
- Payment reminders before expiry
- Revenue analytics
- Export client data
- Dark mode
- Push notifications
- Client portal
