/**
 * Connectivity Test
 * Tests AIMA website accessibility and geolocation
 */

import axios from 'axios';
import { chromium } from 'playwright';
import { AIMA_URLS, SELECTORS, PORTUGUESE_LOCALE } from '../src/config/constants';
import { logger } from '../src/utils/logger.util';

async function testConnectivity(): Promise<void> {
  logger.info('='.repeat(60));
  logger.info('Testing AIMA Connectivity');
  logger.info('='.repeat(60));

  // Test 1: Direct HTTP request
  await testHttpAccess();

  // Test 2: Browser access
  await testBrowserAccess();

  // Test 3: Check current IP location
  await testIpLocation();

  logger.info('='.repeat(60));
  logger.info('Connectivity test completed');
  logger.info('='.repeat(60));
}

async function testHttpAccess(): Promise<void> {
  logger.info('Test 1: Direct HTTP Request');

  try {
    const response = await axios.get(AIMA_URLS.LOGIN_PAGE, {
      timeout: 10000,
      headers: {
        'User-Agent': PORTUGUESE_LOCALE.USER_AGENT,
      },
    });

    logger.logSuccess('HTTP request', { status: response.status });
  } catch (error: unknown) {
    const axiosError = error as { code?: string; message: string };
    logger.logFailure('HTTP request', error);

    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ETIMEDOUT') {
      logger.warn('Site appears to be blocking non-Portuguese IPs');
      logger.info('Solution: Configure a Portuguese proxy in your .env file');
    }
  }
}

async function testBrowserAccess(): Promise<void> {
  logger.info('Test 2: Browser Access');

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      locale: PORTUGUESE_LOCALE.LOCALE,
      timezoneId: PORTUGUESE_LOCALE.TIMEZONE,
      userAgent: PORTUGUESE_LOCALE.USER_AGENT,
    });

    const page = await context.newPage();
    const startTime = Date.now();

    await page.goto(AIMA_URLS.LOGIN_PAGE, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const loadTime = Date.now() - startTime;
    const title = await page.title();
    const hasLoginForm = (await page.$(SELECTORS.LOGIN_FORM)) !== null;

    logger.logSuccess('Browser access', {
      loadTime: `${loadTime}ms`,
      title,
      hasLoginForm,
    });

    // Take screenshot
    await page.screenshot({ path: 'connectivity-test.png' });
    logger.info('Screenshot saved: connectivity-test.png');
  } catch (error) {
    logger.logFailure('Browser access', error);
    logger.info('Possible solutions:');
    logger.info('1. Use a Portuguese proxy server');
    logger.info('2. Deploy to a Portuguese VPS');
    logger.info('3. Use GitHub Actions with proxy');
  } finally {
    await browser.close();
  }
}

async function testIpLocation(): Promise<void> {
  logger.info('Test 3: Current IP Location');

  try {
    const response = await axios.get('https://ipapi.co/json/', { timeout: 10000 });
    const data = response.data;

    logger.info('Your current location', {
      ip: data.ip,
      country: data.country_name,
      city: data.city,
    });

    if (data.country_code !== 'PT') {
      logger.warn('You are not in Portugal. AIMA access will likely fail.');
      logger.info('Recommendation: Configure a Portuguese proxy in your .env file');
      logger.info('See PROXY-GUIDE.md for detailed proxy setup instructions');
    } else {
      logger.logSuccess('Location check', { message: 'You are in Portugal' });
    }
  } catch (error) {
    logger.warn('Could not check IP location', error);
  }
}

// Run the test
testConnectivity().catch((error) => {
  logger.error('Connectivity test failed', error);
  process.exit(1);
});
