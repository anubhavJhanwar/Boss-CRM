import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/config';
import { auth } from '../config/firebase';
import { storage } from './storage';

/**
 * API Service with Firebase Authentication
 * Centralized Axios instance with interceptors for Firebase ID tokens
 */

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add Firebase ID token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Get fresh ID token
        const idToken = await user.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
        // Update stored token
        await storage.setToken(idToken);
      }
    } catch (error) {
      console.error('Error getting ID token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and sign out
      await storage.removeToken();
      await storage.removeUser();
      // Firebase will handle sign out through auth state listener
    }
    return Promise.reject(error);
  }
);

export default api;
