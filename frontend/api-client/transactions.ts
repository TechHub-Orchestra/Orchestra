import axiosInstance from './axios';
import { Transaction, TransactionSummary } from './types';

export const getTransactions = async (params: { cardId?: string; category?: string; page?: number; limit?: number } = {}): Promise<{
  transactions: Transaction[];
  pagination: { total: number; page: number; pages: number };
}> => {
  return axiosInstance.get('/api/transactions', { params });
};

export const getTransactionSummary = async (): Promise<{ summary: TransactionSummary }> => {
  return axiosInstance.get('/api/transactions/summary');
};

export const createRoutedTransaction = async (data: { amount: number; merchant?: string; category?: string; cardId?: string }): Promise<Transaction> => {
  return axiosInstance.post('/api/transactions', data);
};

export const getAnomalies = async (): Promise<{ anomalies: Transaction[] }> => {
  return axiosInstance.get('/api/anomalies');
};
