/**
 * Browser Service
 * Manages Playwright browser lifecycle and configuration
 */

import { chromium, Browser, BrowserContext, LaunchOptions } from 'playwright';
import { ProxyConfig } from '../types';
import { BrowserError } from '../types/errors';
import { BROWSER_CONFIG, PORTUGUESE_LOCALE } from '../config/constants';
import { logger } from '../utils/logger.util';

export class BrowserService {
  private browser: Browser | null = null;
  private proxyConfig?: ProxyConfig;

  constructor(proxyConfig?: ProxyConfig) {
    this.proxyConfig = proxyConfig;

    if (proxyConfig) {
      logger.info('Proxy configured', { server: proxyConfig.server });
    }
  }

  /**
   * Launch the browser instance
   */
  async launch(): Promise<void> {
    try {
      logger.logStart('Browser launch');

      const launchOptions: LaunchOptions = {
        headless: BROWSER_CONFIG.HEADLESS,
        args: [...BROWSER_CONFIG.ARGS],
        proxy: this.proxyConfig,
      };

      this.browser = await chromium.launch(launchOptions);

      logger.logSuccess('Browser launched');
    } catch (error) {
      logger.logFailure('Browser launch', error);
      throw new BrowserError('Failed to launch browser', error);
    }
  }

  /**
   * Create a new browser context configured for Portuguese locale
   */
  async createContext(): Promise<BrowserContext> {
    if (!this.browser) {
      throw new BrowserError('Browser not initialized. Call launch() first.');
    }

    try {
      logger.logStart('Browser context creation');

      const context = await this.browser.newContext({
        locale: PORTUGUESE_LOCALE.LOCALE,
        timezoneId: PORTUGUESE_LOCALE.TIMEZONE,
        geolocation: PORTUGUESE_LOCALE.GEOLOCATION,
        permissions: ['geolocation'],
        userAgent: PORTUGUESE_LOCALE.USER_AGENT,
      });

      logger.logSuccess('Browser context created');
      return context;
    } catch (error) {
      logger.logFailure('Browser context creation', error);
      throw new BrowserError('Failed to create browser context', error);
    }
  }

  /**
   * Close the browser instance and cleanup resources
   */
  async close(): Promise<void> {
    if (!this.browser) {
      return;
    }

    try {
      logger.logStart('Browser cleanup');
      await this.browser.close();
      this.browser = null;
      logger.logSuccess('Browser closed');
    } catch (error) {
      logger.logFailure('Browser cleanup', error);
      throw new BrowserError('Failed to close browser', error);
    }
  }

  /**
   * Check if browser is initialized
   */
  isInitialized(): boolean {
    return this.browser !== null;
  }
}
