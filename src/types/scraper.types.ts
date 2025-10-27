/**
 * Scraper-related type definitions
 */

import { Page } from 'playwright';

export interface ScraperResult {
  success: boolean;
  message: string;
  emailId?: string;
  timestamp: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded
}

export interface EmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  attachments: EmailAttachment[];
}

export interface AuthResult {
  page: Page;
  success: boolean;
}
