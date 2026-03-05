/**
 * App Configuration
 * Centralized configuration for API endpoints and app settings
 * Uses environment variables for security
 */

// API Base URL - from environment variable
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GET_ME: '/auth/me',
  
  // Clients
  CLIENTS: '/clients',
  CLIENT_BY_ID: (id: string) => `/clients/${id}`,
  DASHBOARD_STATS: '/clients/stats/dashboard'
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data'
};

// App Settings
export const APP_SETTINGS = {
  TOKEN_EXPIRY_DAYS: 30,
  PAGINATION_LIMIT: 20
};
