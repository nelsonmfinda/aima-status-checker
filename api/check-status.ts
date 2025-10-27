/**
 * Vercel Serverless Function Handler
 * Endpoint for automated AIMA status checks via cron
 */

import { getConfig } from '../src/config/environment';
import { ScraperService } from '../src/services/scraper.service';
import { logger } from '../src/utils/logger.util';
import { VERCEL_CONFIG } from '../src/config/constants';

export const maxDuration = VERCEL_CONFIG.MAX_DURATION;

interface VercelRequest {
  headers: {
    authorization?: string;
  };
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(data: unknown): void;
}

/**
 * Verify request authorization using Bearer token
 */
function isAuthorized(req: VercelRequest, cronSecret?: string): boolean {
  if (!cronSecret) {
    return true;
  }

  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${cronSecret}`;
}

/**
 * Main handler for Vercel serverless function
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const config = getConfig();

    if (!isAuthorized(req, config.cronSecret)) {
      logger.warn('Unauthorized request attempt');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or missing authorization token',
      });
    }

    const scraper = new ScraperService(config);
    const result = await scraper.execute();
    const statusCode = result.success ? 200 : 500;
    return res.status(statusCode).json(result);
  } catch (error) {
    logger.error('Handler error', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
