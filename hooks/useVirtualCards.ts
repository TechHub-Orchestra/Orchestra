import { useQuery, useMutation } from '@tanstack/react-query';
import { getVirtualCards, createVirtualCard, updateVirtualCardStatus } from '@/api/virtual-cards';
import { queryClient } from '@/lib/queryClient';

export const useVirtualCards = () => {
  return useQuery({
    queryKey: ['virtual-cards'],
    queryFn: getVirtualCards,
  });
};

export const useCreateVirtualCard = () => {
  return useMutation({
    mutationFn: createVirtualCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtual-cards'] });
    },
  });
};

export const useUpdateVirtualCardStatus = () => {
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'pause' | 'resume' | 'delete' }) => updateVirtualCardStatus(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtual-cards'] });
    },
  });
};
