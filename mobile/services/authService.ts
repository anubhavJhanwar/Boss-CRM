import { 
  signInWithCustomToken, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '../config/firebase';
import { API_BASE_URL } from '../constants/config';
import { storage } from './storage';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

/**
 * Firebase Auth Service
 * Handles user authentication with Firebase
 */

export const authService = {
  /**
   * Sign up new user
   */
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      // Call backend to create user in Firebase Auth and Firestore
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
      
      if (response.data.success && response.data.token) {
        // Sign in with custom token
        await signInWithCustomToken(auth, response.data.token);
        
        // Get ID token for API calls
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          await storage.setToken(idToken);
          await storage.setUser(JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Signup failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      // Call backend to verify credentials
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      
      if (response.data.success && response.data.token) {
        // Sign in with custom token
        await signInWithCustomToken(auth, response.data.token);
        
        // Get ID token for API calls
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          await storage.setToken(idToken);
          await storage.setUser(JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await firebaseSignOut(auth);
    await storage.removeToken();
    await storage.removeUser();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Refresh token if needed
        const idToken = await user.getIdToken(true);
        await storage.setToken(idToken);
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const idToken = await user.getIdToken();
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      return response.data.user;
    } catch (error) {
      return null;
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Get current ID token
   */
  getIdToken: async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
};
