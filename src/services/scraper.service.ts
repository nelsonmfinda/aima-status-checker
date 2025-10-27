/**
 * Scraper Service
 * Orchestrates the AIMA scraping workflow
 */

import { AppConfig, ScraperResult } from '../types';
import { BrowserService } from './browser.service';
import { AuthService } from './auth.service';
import { ScreenshotService } from './screenshot.service';
import { EmailService } from './email.service';
import { logger } from '../utils/logger.util';
import { getISOTimestamp } from '../utils/date.util';

export class ScraperService {
  private browserService: BrowserService;
  private authService: AuthService;
  private screenshotService: ScreenshotService;
  private emailService: EmailService;

  constructor(config: AppConfig) {
    this.browserService = new BrowserService(config.proxy);
    this.authService = new AuthService(config.aima, config.debug);
    this.screenshotService = new ScreenshotService();
    this.emailService = new EmailService(config.email);
  }

  /**
   * Execute the complete scraping workflow
   */
  async execute(): Promise<ScraperResult> {
    try {
      logger.info('='.repeat(60));
      logger.info('Starting AIMA status check');
      logger.info('='.repeat(60));

      await this.browserService.launch();

      const context = await this.browserService.createContext();
      const authResult = await this.authService.login(context);

      if (!authResult.success) {
        throw new Error('Authentication failed');
      }

      const screenshot = await this.screenshotService.capture(authResult.page);
      const emailId = await this.emailService.sendStatusEmail(screenshot);

      logger.info('='.repeat(60));
      logger.info('AIMA status check completed successfully');
      logger.info('='.repeat(60));

      return {
        success: true,
        message: 'AIMA check completed successfully',
        emailId,
        timestamp: getISOTimestamp(),
      };
    } catch (error) {
      logger.error('AIMA status check failed', error);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: getISOTimestamp(),
      };
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Cleanup resources
   */
  private async cleanup(): Promise<void> {
    try {
      await this.browserService.close();
    } catch (error) {
      logger.warn('Error during cleanup', error);
    }
  }
}
