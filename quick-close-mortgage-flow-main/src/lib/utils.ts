import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return '';
  }
  
  // In production, use the VERCEL_URL or NEXTAUTH_URL environment variable
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback to NEXTAUTH_URL or default to localhost
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}
