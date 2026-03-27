import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractErrorMessage(err: any): string {
  // If it's a string, return it
  if (typeof err === 'string') return err;

  // Handle Axios/Fetch error responses
  const data = err?.response?.data || err?.data;
  
  if (data) {
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return typeof data.error === 'string' ? data.error : (data.error.message || 'An error occurred');
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0].message || `Error in field: ${data.errors[0].field}`;
    }
  }

  return err?.message || 'An unexpected error occurred';
}
