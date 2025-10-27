/**
 * Main entry point for AIMA Status Checker
 * Can be run locally for testing or development
 */

import { getConfig } from './src/config/environment';
import { ScraperService } from './src/services/scraper.service';
import { logger } from './src/utils/logger.util';
import { ConfigurationError } from './src/types/errors';

async function main(): Promise<void> {
  try {
    const config = getConfig();
    const scraper = new ScraperService(config);
    const result = await scraper.execute();

    if (result.success) {
      process.exit(0);
    } else {
      logger.error('Scraper execution failed', { result });
      process.exit(1);
    }
  } catch (error) {
    if (error instanceof ConfigurationError) {
      logger.error('Configuration error', error);
      logger.info('Please check your .env file and ensure all required variables are set.');
    } else {
      logger.error('Unexpected error', error);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main };
