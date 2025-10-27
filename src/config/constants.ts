/**
 * Application constants
 * All magic numbers, URLs, selectors, and configuration values
 */

export const AIMA_URLS = {
  LOGIN_PAGE: 'https://services.aima.gov.pt/RAR/login.php',
} as const;

export const SELECTORS = {
  LOGIN_FORM: '#login_form',
  EMAIL_INPUT: 'input[name="email"]',
  PASSWORD_INPUT: 'input[name="password"]',
  SUBMIT_BUTTON: 'button[type="submit"]',
} as const;

export const TIMEOUTS = {
  NAVIGATION: 45000, // 45 seconds
  NAVIGATION_AFTER_LOGIN: 60000, // 60 seconds
  FORM_WAIT: 20000, // 20 seconds
  INPUT_FILL: 10000, // 10 seconds
  HUMAN_DELAY: 1000, // 1 second - mimic human behavior
  POST_LOGIN_WAIT: 3000, // 3 seconds
  SCREENSHOT_WAIT: 2000, // 2 seconds
  RETRY_DELAY: 5000, // 5 seconds between retries
} as const;

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 5000, // 5 seconds
} as const;

export const BROWSER_CONFIG = {
  HEADLESS: true,
  ARGS: ['--no-sandbox', '--disable-setuid-sandbox'],
} as const;

export const PORTUGUESE_LOCALE = {
  LOCALE: 'pt-PT',
  TIMEZONE: 'Europe/Lisbon',
  GEOLOCATION: {
    latitude: 38.7223, // Lisbon coordinates
    longitude: -9.1393,
  },
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
} as const;

export const EMAIL_CONFIG = {
  DEFAULT_SENDER: 'AIMA Status <onboarding@resend.dev>',
  SUBJECT_PREFIX: 'AIMA Status Update',
  SCREENSHOT_FILENAME_PREFIX: 'aima-status',
  ERROR_SCREENSHOT_FILENAME: 'error-screenshot.png',
} as const;

export const LOG_PREFIX = '[AIMA]' as const;

export const VERCEL_CONFIG = {
  MAX_DURATION: 60, // 60 seconds function timeout
} as const;
