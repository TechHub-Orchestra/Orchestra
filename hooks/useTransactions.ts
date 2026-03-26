import { useQuery, useMutation } from '@tanstack/react-query';
import { getTransactions, createRoutedTransaction, getAnomalies } from '@/api/transactions';

export const useTransactions = (params: { cardId?: string; category?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => getTransactions(params),
  });
};

export const useCreateRoutedTransaction = () => {
  return useMutation({
    mutationFn: createRoutedTransaction,
  });
};

export const useAnomalies = () => {
  return useQuery({
    queryKey: ['anomalies'],
    queryFn: getAnomalies,
    refetchInterval: 60000, // Poll for anomalies every 1m
  });
};
