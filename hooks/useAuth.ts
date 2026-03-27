import { useQuery, useMutation } from '@tanstack/react-query';
import { loginUser, registerUser, getCurrentUser } from '@/api/auth';
import { tokenStorage } from '@/utils/tokenStorage';
import { queryClient } from '@/lib/queryClient';
import { useRouter } from 'next/navigation';

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
    onSuccess: (data) => {
      tokenStorage.setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    enabled: !!tokenStorage.getToken() && enabled,
    retry: false,               // don't retry auth failures
    staleTime: 5 * 60 * 1000,  // treat user as fresh for 5 min
    refetchOnWindowFocus: false, // don't refetch on tab switch
  });
};

export const useLogout = () => {
  const router = useRouter();
  const logout = () => {
    tokenStorage.clearToken();
    queryClient.clear();
    router.replace('/login');
  };
  return logout;
};
