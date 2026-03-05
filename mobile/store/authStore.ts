import { create } from 'zustand';
import { storage } from '../services/storage';
import { authService } from '../services/authService';

/**
 * Auth Store
 * Global state management for authentication using Zustand
 */

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
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
      const response = await authService.login({ email, password });
      set({
        user: response.user,
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
      const token = await storage.getToken();
      const userStr = await storage.getUser();

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
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

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  clearError: () => set({ error: null })
}));
