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

/**
 * Format a phone number to (XXX) XXX-XXXX format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Format based on length
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return phoneNumber;
  
  const formatted = [];
  if (match[1]) formatted.push(`(${match[1]}`);
  if (match[2]) formatted.push(`) ${match[2]}`);
  if (match[3]) formatted.push(`-${match[3]}`);
  
  return formatted.join('');
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Parse a currency string to a number
 */
export function parseCurrency(value: string): number | null {
  if (!value) return null;
  // Remove all non-digit characters except decimal point
  const numStr = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(numStr);
  return isNaN(num) ? null : num;
}

/**
 * Format a number with commas
 */
export function formatNumberWithCommas(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string | number, options: Intl.DateTimeFormatOptions = {}) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Truncate text to a certain length and add ellipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
