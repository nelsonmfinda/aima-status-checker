/**
 * Email Test
 * Tests Resend email configuration and delivery
 */

import { getConfig } from '../src/config/environment';
import { EmailService } from '../src/services/email.service';
import { logger } from '../src/utils/logger.util';
import { formatDateTimePT } from '../src/utils/date.util';

async function testEmail(): Promise<void> {
  logger.info('='.repeat(60));
  logger.info('Testing Resend Email Configuration');
  logger.info('='.repeat(60));

  try {
    // Load configuration
    const config = getConfig();

    logger.info('Configuration loaded', {
      senderEmail: config.email.senderEmail,
      recipientEmail: config.email.recipientEmail,
      apiKeySet: !!config.email.apiKey,
    });

    // Create email service
    const emailService = new EmailService(config.email);

    // Create test email content
    const testContent = Buffer.from(
      `This is a test email from AIMA Status Checker.\nSent at: ${formatDateTimePT()}`
    );

    // Send test email
    logger.info('Sending test email...');
    const emailId = await emailService.sendStatusEmail(testContent);

    logger.info('='.repeat(60));
    logger.logSuccess('Email test', {
      emailId,
      message: 'Check your inbox for the test email',
    });
    logger.info('You can view the email status at: https://resend.com/emails');
    logger.info('='.repeat(60));
  } catch (error) {
    logger.error('Email test failed', error);
    logger.info('Troubleshooting tips:');
    logger.info('1. Check your RESEND_API_KEY is correct');
    logger.info('2. Verify RECIPIENT_EMAIL is valid');
    logger.info('3. If using custom domain, ensure it is verified in Resend dashboard');
    logger.info('4. For testing, you can use: onboarding@resend.dev as SENDER_EMAIL');
    process.exit(1);
  }
}

// Run the test
testEmail().catch((error) => {
  logger.error('Test execution failed', error);
  process.exit(1);
});
