/**
 * Screenshot Service
 * Handles capturing screenshots from web pages
 */

import { Page } from 'playwright';
import { ScreenshotError } from '../types/errors';
import { TIMEOUTS } from '../config/constants';
import { logger } from '../utils/logger.util';

export class ScreenshotService {
  /**
   * Capture a full-page screenshot
   */
  async capture(page: Page): Promise<Buffer> {
    try {
      logger.logStart('Screenshot capture');

      await this.scrollToTop(page);
      await page.waitForTimeout(TIMEOUTS.SCREENSHOT_WAIT);

      const screenshot = await page.screenshot({
        fullPage: true,
        type: 'png',
      });

      logger.logSuccess('Screenshot captured', {
        size: `${(screenshot.length / 1024).toFixed(2)} KB`,
      });

      return screenshot;
    } catch (error) {
      logger.logFailure('Screenshot capture', error);
      throw new ScreenshotError('Failed to capture screenshot', error);
    }
  }

  /**
   * Scroll page to top before taking screenshot
   */
  private async scrollToTop(page: Page): Promise<void> {
    try {
      await page.evaluate('window.scrollTo(0, 0)');
      logger.debug('Scrolled to top');
    } catch (error) {
      logger.warn('Failed to scroll to top', error);
    }
  }
}
