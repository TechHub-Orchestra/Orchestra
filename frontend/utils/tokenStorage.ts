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
    const parts = token.split('.');
    let payload;
    
    if (parts.length === 3) {
      // Standard 3-part JWT
      payload = JSON.parse(decodeBase64Url(parts[1]));
    } else {
      // Single-part base64 token (simple JSON)
      payload = JSON.parse(decodeBase64Url(token));
    }

    if (!payload.exp) return false;

    // JWT exp is in seconds; our simple token might be in milliseconds
    // If it's larger than a reasonable "seconds" timestamp, it's likely milliseconds
    const now = Date.now();
    const exp = payload.exp > 10000000000 ? payload.exp : payload.exp * 1000;
    
    return now > exp;
  } catch (err) {
    // If we can't parse the token, don't clear it — 
    // let the server decide if it's valid (avoids false evictions)
    console.warn('Token parsing failed in isExpired:', err);
    return false;
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
