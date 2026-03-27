'use client';

const TOKEN_KEY = 'orchestra_token';

function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // exp is in seconds (JWT standard)
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true; // treat malformed token as expired
  }
}

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    // Auto-evict expired tokens so the layout guard fires immediately
    if (isExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },
};
