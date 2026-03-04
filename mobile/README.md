# Mobile App - Subscription CRM

React Native mobile app built with Expo for managing subscription clients.

## Features

- JWT authentication
- Dashboard with statistics
- Client CRUD operations
- Search and filter
- Status tracking
- Offline token storage
- Clean UI with NativeWind

## Installation

```bash
npm install
```

## Configuration

Update `constants/config.ts`:
```typescript
export const API_BASE_URL = 'http://your-backend-url/api';
```

## Run

Start Expo:
```bash
npx expo start
```

Options:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app

## Build APK

Install EAS CLI:
```bash
npm install -g eas-cli
```

Configure:
```bash
eas build:configure
```

Build:
```bash
eas build --platform android --profile production
```

## Project Structure

```
mobile/
├── components/      # Reusable components
├── constants/       # Configuration
├── screens/         # App screens
├── services/        # API services
├── store/           # Zustand state
├── types/           # TypeScript types
└── App.tsx          # Entry point
```

## Screens

1. Login - Admin authentication
2. Dashboard - Statistics overview
3. Clients List - All clients with filters
4. Add Client - Create new subscription
5. Edit Client - Update details
6. Client Details - View full info
7. Settings - Account & logout

## State Management

Using Zustand for global state:
- `authStore` - Authentication state
- `clientStore` - Client data & operations

## API Integration

All API calls in `services/`:
- `authService.ts` - Authentication
- `clientService.ts` - Client operations
- `api.ts` - Axios instance with interceptors
- `storage.ts` - Secure token storage

## Testing

1. Start backend server
2. Update API URL in config
3. Run `npx expo start`
4. Test on device/emulator
