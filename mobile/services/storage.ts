import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure Storage Service
 * Handles secure storage of sensitive data
 * Uses SecureStore on mobile, localStorage on web
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data'
};

// Check if running on web
const isWeb = Platform.OS === 'web';

export const storage = {
  // Token Management
  setToken: async (token: string): Promise<void> => {
    try {
      if (isWeb) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
      }
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      if (isWeb) {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      } else {
        return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      }
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      if (isWeb) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      } else {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // User Data Management
  setUser: async (userData: string): Promise<void> => {
    try {
      if (isWeb) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, userData);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  getUser: async (): Promise<string | null> => {
    try {
      if (isWeb) {
        return localStorage.getItem(STORAGE_KEYS.USER_DATA);
      } else {
        return await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  removeUser: async (): Promise<void> => {
    try {
      if (isWeb) {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } else {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
      }
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  // Clear all storage
  clear: async (): Promise<void> => {
    await storage.removeToken();
    await storage.removeUser();
  }
};
