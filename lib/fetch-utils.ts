import { tokenStorage } from '@/utils/tokenStorage';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = tokenStorage.getToken();
  
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    tokenStorage.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return res;
}
