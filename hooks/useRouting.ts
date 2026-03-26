import { useQuery, useMutation } from '@tanstack/react-query';
import { getRoutingRule, updateRoutingRule, simulateRouting } from '@/api/routing';
import { queryClient } from '@/lib/queryClient';

export const useRoutingRule = () => {
  return useQuery({
    queryKey: ['routing-rule'],
    queryFn: getRoutingRule,
  });
};

export const useUpdateRoutingRule = () => {
  return useMutation({
    mutationFn: updateRoutingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routing-rule'] });
    },
  });
};

export const useSimulateRouting = () => {
  return useMutation({
    mutationFn: simulateRouting,
  });
};
