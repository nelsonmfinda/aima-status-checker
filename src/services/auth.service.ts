/**
 * Authentication Service
 * Handles login to AIMA website
 */

import { BrowserContext, Page } from 'playwright';
import { AimaCredentials, AuthResult } from '../types';
import { AuthenticationError } from '../types/errors';
import { AIMA_URLS, SELECTORS, TIMEOUTS, RETRY_CONFIG } from '../config/constants';
import { logger } from '../utils/logger.util';
import { retry } from '../utils/retry.util';

export class AuthService {
  private credentials: AimaCredentials;
  private debugMode: boolean;

  constructor(credentials: AimaCredentials, debugMode: boolean = false) {
    this.credentials = credentials;
    this.debugMode = debugMode;
  }

  /**
   * Perform login to AIMA website
   */
  async login(context: BrowserContext): Promise<AuthResult> {
    const page = await context.newPage();

    try {
      logger.logStart('AIMA login');

      await this.navigateToLogin(page);
      await this.waitForLoginForm(page);
      await this.fillCredentials(page);

      if (this.debugMode) {
        await this.takeDebugScreenshot(page);
      }

      await this.submitLogin(page);

      logger.logSuccess('AIMA login');

      return {
        page,
        success: true,
      };
    } catch (error) {
      logger.logFailure('AIMA login', error);

      await this.takeErrorScreenshot(page);
      throw new AuthenticationError('Failed to login to AIMA', error);
    }
  }

  /**
   * Navigate to login page with retry logic
   */
  private async navigateToLogin(page: Page): Promise<void> {
    logger.info('Navigating to login page');

    await retry(
      async () => {
        await page.goto(AIMA_URLS.LOGIN_PAGE, {
          waitUntil: 'domcontentloaded',
          timeout: TIMEOUTS.NAVIGATION,
        });
      },
      {
        maxAttempts: RETRY_CONFIG.MAX_ATTEMPTS,
        initialDelayMs: RETRY_CONFIG.INITIAL_DELAY,
      }
    );

    const title = await page.title();
    logger.debug(`Page loaded: ${title}`);
  }

  /**
   * Wait for login form to be visible
   */
  private async waitForLoginForm(page: Page): Promise<void> {
    logger.info('Waiting for login form');

    await page.waitForSelector(SELECTORS.LOGIN_FORM, {
      timeout: TIMEOUTS.FORM_WAIT,
      state: 'visible',
    });

    logger.debug('Login form found');
  }

  /**
   * Fill in credentials with human-like delays
   */
  private async fillCredentials(page: Page): Promise<void> {
    logger.info('Filling credentials');

    await page.fill(SELECTORS.EMAIL_INPUT, this.credentials.email, {
      timeout: TIMEOUTS.INPUT_FILL,
    });
    await page.waitForTimeout(TIMEOUTS.HUMAN_DELAY);

    await page.fill(SELECTORS.PASSWORD_INPUT, this.credentials.password, {
      timeout: TIMEOUTS.INPUT_FILL,
    });
    await page.waitForTimeout(TIMEOUTS.HUMAN_DELAY);

    logger.debug('Credentials filled');
  }

  /**
   * Submit login form and wait for navigation
   */
  private async submitLogin(page: Page): Promise<void> {
    logger.info('Submitting login form');

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle',
        timeout: TIMEOUTS.NAVIGATION_AFTER_LOGIN,
      }),
      page.click(SELECTORS.SUBMIT_BUTTON),
    ]);

    await page.waitForTimeout(TIMEOUTS.POST_LOGIN_WAIT);
    logger.debug('Login submitted successfully');
  }

  /**
   * Take debug screenshot before login
   */
  private async takeDebugScreenshot(page: Page): Promise<void> {
    try {
      await page.screenshot({ path: 'before-login.png' });
      logger.debug('Debug screenshot saved: before-login.png');
    } catch (error) {
      logger.warn('Failed to save debug screenshot', error);
    }
  }

  /**
   * Take error screenshot for debugging
   */
  private async takeErrorScreenshot(page: Page): Promise<void> {
    try {
      await page.screenshot({
        path: 'error-screenshot.png',
        fullPage: true,
      });
      logger.debug('Error screenshot saved: error-screenshot.png');
    } catch (error) {
      logger.warn('Failed to save error screenshot', error);
    }
  }
}
