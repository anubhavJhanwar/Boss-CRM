import { create } from 'zustand';
import { Client, DashboardStats } from '../types';
import { clientService } from '../services/clientService';

/**
 * Client Store
 * Global state management for clients using Zustand
 */

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchClients: (status?: string, search?: string) => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  createClient: (clientData: Partial<Client>) => Promise<void>;
  updateClient: (id: string, clientData: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  clearError: () => void;
  clearSelectedClient: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  selectedClient: null,
  dashboardStats: null,
  isLoading: false,
  error: null,

  fetchClients: async (status?: string, search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const clients = await clientService.getClients(status, search);
      set({ clients, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch clients',
        isLoading: false
      });
    }
  },

  fetchClientById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const client = await clientService.getClientById(id);
      set({ selectedClient: client, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch client',
        isLoading: false
      });
    }
  },

  createClient: async (clientData: Partial<Client>) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.createClient(clientData);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create client',
        isLoading: false
      });
      throw error;
    }
  },

  updateClient: async (id: string, clientData: Partial<Client>) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.updateClient(id, clientData);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update client',
        isLoading: false
      });
      throw error;
    }
  },

  deleteClient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await clientService.deleteClient(id);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete client',
        isLoading: false
      });
      throw error;
    }
  },

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching dashboard stats...');
      const stats = await clientService.getDashboardStats();
      console.log('Dashboard stats received:', stats);
      set({ dashboardStats: stats, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      set({
        error: error.message || 'Failed to fetch stats',
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedClient: () => set({ selectedClient: null })
}));
