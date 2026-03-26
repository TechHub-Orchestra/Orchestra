import { useQuery, useMutation } from '@tanstack/react-query';
import { loginUser, registerUser, getCurrentUser } from '@/api/auth';
import { tokenStorage } from '@/utils/tokenStorage';
import { queryClient } from '@/lib/queryClient';

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      tokenStorage.setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    enabled: !!tokenStorage.getToken() && enabled,
  });
};

export const useLogout = () => {
  const logout = () => {
    tokenStorage.clearToken();
    queryClient.clear();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };
  return logout;
};
