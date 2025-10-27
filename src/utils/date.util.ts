/**
 * Date formatting utilities
 * Provides consistent date/time formatting across the application
 */

const PORTUGUESE_LOCALE = 'pt-PT';

/**
 * Format date for Portuguese locale (DD/MM/YYYY)
 */
export function formatDatePT(date: Date = new Date()): string {
  return date.toLocaleDateString(PORTUGUESE_LOCALE);
}

/**
 * Format date and time for Portuguese locale
 */
export function formatDateTimePT(date: Date = new Date()): string {
  return date.toLocaleString(PORTUGUESE_LOCALE);
}

/**
 * Get ISO date string (YYYY-MM-DD)
 */
export function getISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get ISO timestamp string
 */
export function getISOTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Generate filename with date suffix
 * Example: "screenshot-2024-01-15.png"
 */
export function generateDateFilename(prefix: string, extension: string, date: Date = new Date()): string {
  const dateStr = getISODate(date);
  return `${prefix}-${dateStr}.${extension}`;
}
