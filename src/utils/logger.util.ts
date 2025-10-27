/**
 * Structured logging utility
 * Provides consistent logging format across the application
 */

import { LOG_PREFIX } from '../config/constants';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private prefix: string;

  constructor(prefix: string = LOG_PREFIX) {
    this.prefix = prefix;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const parts = [this.prefix, `[${level}]`, `[${timestamp}]`, message];

    if (data !== undefined) {
      parts.push(JSON.stringify(data, null, 2));
    }

    return parts.join(' ');
  }

  debug(message: string, data?: unknown): void {
    console.log(this.formatMessage(LogLevel.DEBUG, message, data));
  }

  info(message: string, data?: unknown): void {
    console.log(this.formatMessage(LogLevel.INFO, message, data));
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, data));
  }

  error(message: string, error?: unknown): void {
    const errorData = error instanceof Error
      ? { message: error.message, stack: error.stack }
      : error;

    console.error(this.formatMessage(LogLevel.ERROR, message, errorData));
  }

  /**
   * Log the start of an operation
   */
  logStart(operation: string): void {
    this.info(`Starting: ${operation}`);
  }

  /**
   * Log the successful completion of an operation
   */
  logSuccess(operation: string, data?: unknown): void {
    this.info(`Completed: ${operation}`, data);
  }

  /**
   * Log the failure of an operation
   */
  logFailure(operation: string, error: unknown): void {
    this.error(`Failed: ${operation}`, error);
  }
}

export const logger = new Logger();

export { Logger };
