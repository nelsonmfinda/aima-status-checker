/**
 * Generic retry utility with exponential backoff
 */

import { logger } from './logger.util';

export interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs?: number;
  exponentialBackoff?: boolean;
  onRetry?: (attempt: number, error: unknown) => void;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  exponentialBackoff: true,
};

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay for next retry attempt
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  exponential: boolean
): number {
  if (!exponential) {
    return initialDelay;
  }

  const delay = initialDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Retry an async operation with configurable backoff strategy
 *
 * @param operation - The async operation to retry
 * @param options - Retry configuration options
 * @returns The result of the operation
 * @throws The last error if all attempts fail
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config: RetryOptions = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === config.maxAttempts) {
        logger.error(`All ${config.maxAttempts} retry attempts failed`, error);
        throw error;
      }

      const delay = calculateDelay(
        attempt,
        config.initialDelayMs,
        config.maxDelayMs!,
        config.exponentialBackoff!
      );

      logger.warn(
        `Attempt ${attempt}/${config.maxAttempts} failed. Retrying in ${delay}ms...`,
        error
      );

      if (config.onRetry) {
        config.onRetry(attempt, error);
      }

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Create a retry function with predefined options
 * Useful for creating domain-specific retry functions
 */
export function createRetryFunction<T>(
  defaultOptions: Partial<RetryOptions>
): (operation: () => Promise<T>, options?: Partial<RetryOptions>) => Promise<T> {
  return (operation: () => Promise<T>, options?: Partial<RetryOptions>) => {
    return retry(operation, { ...defaultOptions, ...options });
  };
}
