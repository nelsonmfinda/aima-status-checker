/**
 * Environment configuration with validation
 * Validates and provides type-safe access to environment variables
 */

import * as dotenv from 'dotenv';
import { AppConfig, ProxyConfig } from '../types';
import { ConfigurationError } from '../types/errors';
import { EMAIL_CONFIG } from './constants';

// Load environment variables
dotenv.config();

/**
 * Validates that a required environment variable exists
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ConfigurationError(
      `Missing required environment variable: ${name}. Please check your .env file.`
    );
  }
  return value;
}

/**
 * Gets an optional environment variable
 */
function getEnv(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue;
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Builds proxy configuration if proxy server is provided
 */
function getProxyConfig(): ProxyConfig | undefined {
  const proxyServer = getEnv('PROXY_SERVER');

  if (!proxyServer) {
    return undefined;
  }

  const username = getEnv('PROXY_USERNAME');
  const password = getEnv('PROXY_PASSWORD');

  return {
    server: proxyServer,
    ...(username && { username }),
    ...(password && { password }),
  };
}

/**
 * Loads and validates application configuration
 */
export function loadConfig(): AppConfig {
  try {
    const aimaEmail = requireEnv('AIMA_EMAIL');
    const aimaPassword = requireEnv('AIMA_PASSWORD');

    if (!isValidEmail(aimaEmail)) {
      throw new ConfigurationError(`Invalid email format for AIMA_EMAIL: ${aimaEmail}`);
    }

    const resendApiKey = requireEnv('RESEND_API_KEY');
    const recipientEmail = requireEnv('RECIPIENT_EMAIL');

    if (!isValidEmail(recipientEmail)) {
      throw new ConfigurationError(`Invalid email format for RECIPIENT_EMAIL: ${recipientEmail}`);
    }

    const senderEmail = getEnv('SENDER_EMAIL') || EMAIL_CONFIG.DEFAULT_SENDER;
    const proxyConfig = getProxyConfig();
    const cronSecret = getEnv('CRON_SECRET');
    const debug = (getEnv('DEBUG') || 'false').toLowerCase() === 'true';

    return {
      aima: {
        email: aimaEmail,
        password: aimaPassword,
      },
      email: {
        apiKey: resendApiKey,
        senderEmail,
        recipientEmail,
      },
      proxy: proxyConfig,
      cronSecret,
      debug,
    };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      throw error;
    }
    throw new ConfigurationError('Failed to load configuration', error);
  }
}

let configInstance: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!configInstance) {
    configInstance = loadConfig();
  }
  return configInstance;
}

// Allow resetting config (useful for testing)
export function resetConfig(): void {
  configInstance = null;
}
