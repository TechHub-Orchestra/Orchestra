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
    // Optional: handle unauthorized globally (e.g. redirect to login)
    // tokenStorage.clearToken();
    // if (typeof window !== 'undefined') window.location.href = '/login';
  }

  return res;
}
