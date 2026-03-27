const BASE_URL = 'https://orchestra-server.onrender.com';

export async function apiClient<T>(
  path: string,
  method: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('orchestra_token') : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('orchestra_token');
      // window.location.href = '/login'; // Optional: Redirect to login
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw data || { message: 'An unknown error occurred' };
  }

  return data;
}
