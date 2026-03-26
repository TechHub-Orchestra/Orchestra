import { useQuery, useMutation } from '@tanstack/react-query';
import { getCards, createCard, getCardById, updateCardStatus, deleteCard, getCardBalance } from '@/api/cards';
import { queryClient } from '@/lib/queryClient';

export const useCards = () => {
  return useQuery({
    queryKey: ['cards'],
    queryFn: getCards,
  });
};

export const useCard = (id: string) => {
  return useQuery({
    queryKey: ['cards', id],
    queryFn: () => getCardById(id),
    enabled: !!id,
  });
};

export const useCreateCard = () => {
  return useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};

export const useUpdateCardStatus = () => {
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'block' | 'unblock' }) => updateCardStatus(id, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['cards', variables.id] });
    },
  });
};

export const useDeleteCard = () => {
  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
};

export const useCardBalance = (id: string) => {
  return useQuery({
    queryKey: ['cards', id, 'balance'],
    queryFn: () => getCardBalance(id),
    enabled: !!id,
    refetchInterval: 30000, // Poll every 30s
  });
};
