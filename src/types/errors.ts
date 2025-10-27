/**
 * Custom error classes for better error handling
 */

export class AimaError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'AimaError';
    Object.setPrototypeOf(this, AimaError.prototype);
  }
}

export class BrowserError extends AimaError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'BrowserError';
    Object.setPrototypeOf(this, BrowserError.prototype);
  }
}

export class AuthenticationError extends AimaError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class ScreenshotError extends AimaError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'ScreenshotError';
    Object.setPrototypeOf(this, ScreenshotError.prototype);
  }
}

export class EmailError extends AimaError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'EmailError';
    Object.setPrototypeOf(this, EmailError.prototype);
  }
}

export class ConfigurationError extends AimaError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'ConfigurationError';
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}
