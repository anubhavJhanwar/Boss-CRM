import { create } from 'zustand';
import { Admin } from '../types';
import { authService } from '../services/authService';
import { getToken, getUserData } from '../services/storage';

/**
 * Auth Store
 * Global state management for authentication using Zustand
 */

interface AuthState {
  user: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({
        user: {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name
        },
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false
      });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(email, password, name);
      set({
        user: {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name
        },
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Registration failed',
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await getToken();
      const userData = await getUserData();

      if (token && userData) {
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null })
}));
