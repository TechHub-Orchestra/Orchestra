export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'individual' | 'business';
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: string;
  pan: string;
  expiryDate: string;
  issuerNr: string;
  cardStatus: string;
  cardType: 'debit' | 'prepaid' | 'virtual';
  label: string;
  isDefault: boolean;
  spendLimit: number;
}

export interface VirtualCard {
  _id: string;
  userId: string;
  parentCardId: string;
  label: string;
  merchant?: string;
  spendLimit: number;
  amountSpent: number;
  autoRenew: boolean;
  paused: boolean;
  pan: string;
  expiryDate: string;
}

export interface BusinessCard {
  _id: string;
  businessUserId: string;
  assignedTo: string;
  purpose?: string;
  budget: number;
  amountSpent: number;
  merchantCategories?: string[];
  expiresAt?: string;
  status: 'active' | 'suspended' | 'exhausted';
  approvalThreshold?: number;
  pan: string;
}

export interface Transaction {
  _id: string;
  pan: string;
  cardId: string;
  userId: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  transactionDate: string;
  isAnomaly: boolean;
  anomalyReason?: string;
}

export interface RoutingRule {
  _id: string;
  mode: 'primary' | 'balanced' | 'auto-split';
  primaryCardId?: string;
  cardOrder: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TransactionSummary {
  totalSpent: number;
  transactionCount: number;
  subscriptionSpend: number;
  anomalyCount: number;
  byCategory: Record<string, number>;
  dailySpend: Record<string, number>;
  topMerchants: [string, number][];
}

// Global Response Interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
