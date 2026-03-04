import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import { AuthResponse, Admin, ApiResponse } from '../types';
import { saveToken, saveUserData, clearStorage } from './storage';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Login admin user
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, {
        email,
        password
      });

      if (response.data.success && response.data.data.token) {
        // Save token and user data
        await saveToken(response.data.data.token);
        await saveUserData({
          id: response.data.data.id,
          email: response.data.data.email,
          name: response.data.data.name
        });
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  /**
   * Register admin user (first-time setup)
   */
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.REGISTER, {
        email,
        password,
        name
      });

      if (response.data.success && response.data.data.token) {
        await saveToken(response.data.data.token);
        await saveUserData({
          id: response.data.data.id,
          email: response.data.data.email,
          name: response.data.data.name
        });
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  /**
   * Get current admin profile
   */
  getMe: async (): Promise<Admin> => {
    try {
      const response = await api.get<ApiResponse<Admin>>(API_ENDPOINTS.GET_ME);
      return response.data.data!;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to get profile' };
    }
  },

  /**
   * Logout admin user
   */
  logout: async (): Promise<void> => {
    await clearStorage();
  }
};
