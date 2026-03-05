# Backend - Subscription CRM API

Node.js + Express + MongoDB backend for subscription management.

## Features

- JWT authentication
- RESTful API
- MongoDB with Mongoose
- Automated cron jobs
- Email notifications
- Error handling
- CORS enabled

## Installation

```bash
npm install
```

## Environment Setup

Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@example.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
CORS_ORIGIN=*
```

## Run

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

## Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middleware/      # Auth & error handling
├── services/        # Email service
├── cron/            # Scheduled tasks
├── utils/           # Helper functions
└── server.js        # Entry point
```

## Cron Jobs

### Expiry Check (Midnight - 00:00)
- Check expired subscriptions
- Update client statuses
- Send expiry notifications

### Reminder System (9:00 AM)
- Send reminder emails 3 days before expiry
- Prevents duplicate reminders
- See [REMINDER_SYSTEM.md](./REMINDER_SYSTEM.md) for details

## Testing

```bash
# Health check
curl http://localhost:5000/health

# Register admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123","name":"Admin"}'
```
