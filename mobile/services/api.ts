import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/config';
import { getToken, removeToken } from './storage';

/**
 * API Service
 * Centralized Axios instance with interceptors for authentication
 */

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Token expired or invalid - clear storage
      await removeToken();
    }
    return Promise.reject(error);
  }
);

export default api;
