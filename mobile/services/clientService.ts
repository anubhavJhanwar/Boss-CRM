import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import { Client, DashboardStats, ApiResponse } from '../types';

/**
 * Client Service
 * Handles all client-related API calls
 */

export const clientService = {
  /**
   * Get all clients with optional filters
   */
  getClients: async (status?: string, search?: string): Promise<Client[]> => {
    try {
      const params: any = {};
      if (status && status !== 'All') params.status = status;
      if (search) params.search = search;

      const response = await api.get<ApiResponse<Client[]>>(API_ENDPOINTS.CLIENTS, { params });
      return response.data.data || [];
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch clients' };
    }
  },

  /**
   * Get single client by ID
   */
  getClientById: async (id: string): Promise<Client> => {
    try {
      const response = await api.get<ApiResponse<Client>>(API_ENDPOINTS.CLIENT_BY_ID(id));
      return response.data.data!;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch client' };
    }
  },

  /**
   * Create new client
   */
  createClient: async (clientData: Partial<Client>): Promise<Client> => {
    try {
      const response = await api.post<ApiResponse<Client>>(API_ENDPOINTS.CLIENTS, clientData);
      return response.data.data!;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to create client' };
    }
  },

  /**
   * Update existing client
   */
  updateClient: async (id: string, clientData: Partial<Client>): Promise<Client> => {
    try {
      const response = await api.put<ApiResponse<Client>>(
        API_ENDPOINTS.CLIENT_BY_ID(id),
        clientData
      );
      return response.data.data!;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to update client' };
    }
  },

  /**
   * Delete client
   */
  deleteClient: async (id: string): Promise<void> => {
    try {
      await api.delete(API_ENDPOINTS.CLIENT_BY_ID(id));
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to delete client' };
    }
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>(API_ENDPOINTS.DASHBOARD_STATS);
      return response.data.data!;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch stats' };
    }
  }
};
