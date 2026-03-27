'use client';

const TOKEN_KEY = 'orchestra_token';

/** JWTs use base64url (- and _ instead of + and /). atob() only handles standard base64. */
function decodeBase64Url(str: string): string {
  // Replace base64url chars with standard base64 chars and fix padding
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  return atob(padded)
}

function isExpired(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return true
    const payload = JSON.parse(decodeBase64Url(parts[1]))
    if (!payload.exp) return false
    // JWT exp is in seconds; Date.now() is in milliseconds
    return Date.now() / 1000 > payload.exp
  } catch {
    // If we can't parse the token at all, don't delete it —
    // let the server decide if it's valid (avoids false evictions)
    return false
  }
}

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
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
