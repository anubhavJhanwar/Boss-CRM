/**
 * TypeScript Type Definitions
 * Centralized type definitions for the entire app
 */

export type PaymentMode = 'Cash' | 'Online';
export type ClientStatus = 'Active' | 'Expired' | 'Expiring Soon';

export interface Client {
  _id: string;
  name: string;
  phoneNumber?: string;
  paymentMode: PaymentMode;
  amountPaid: number;
  subscriptionMonths: number;
  startDate: string;
  manualStartDate?: string;
  endDate: string;
  status: ClientStatus;
  notes?: string;
  daysRemaining: number;
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    token: string;
  };
}

export interface DashboardStats {
  activeClients: number;
  expiredClients: number;
  revenueThisMonth: number;
  expiringClients: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}
