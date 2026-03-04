import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../constants/config';
import { Admin } from '../types';

/**
 * Secure Storage Service
 * Handles secure storage of sensitive data
 * Uses SecureStore on mobile, localStorage on web
 */

// Check if running on web
const isWeb = Platform.OS === 'web';

// Token Management
export const saveToken = async (token: string): Promise<void> => {
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
};

export const getToken = async (): Promise<string | null> => {
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
};

export const removeToken = async (): Promise<void> => {
  try {
    if (isWeb) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// User Data Management
export const saveUserData = async (user: Admin): Promise<void> => {
  try {
    const userData = JSON.stringify(user);
    if (isWeb) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
    } else {
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, userData);
    }
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const getUserData = async (): Promise<Admin | null> => {
  try {
    let data: string | null;
    if (isWeb) {
      data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    } else {
      data = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
    }
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeUserData = async (): Promise<void> => {
  try {
    if (isWeb) {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    }
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Clear all storage
export const clearStorage = async (): Promise<void> => {
  await removeToken();
  await removeUserData();
};
