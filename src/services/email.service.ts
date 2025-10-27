/**
 * Email Service
 * Handles sending emails via Resend
 */

import { Resend } from 'resend';
import { EmailConfig, EmailAttachment, EmailPayload } from '../types';
import { EmailError } from '../types/errors';
import { EMAIL_CONFIG } from '../config/constants';
import { logger } from '../utils/logger.util';
import { formatDatePT, formatDateTimePT, generateDateFilename } from '../utils/date.util';

export class EmailService {
  private resend: Resend;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.resend = new Resend(config.apiKey);
  }

  /**
   * Send AIMA status email with screenshot attachment
   */
  async sendStatusEmail(screenshot: Buffer, errorScreenshot?: Buffer): Promise<string> {
    try {
      logger.logStart('Email sending');

      const payload = this.buildEmailPayload(screenshot, errorScreenshot);
      const emailId = await this.send(payload);

      logger.logSuccess('Email sent', { emailId });

      return emailId;
    } catch (error) {
      logger.logFailure('Email sending', error);
      throw new EmailError('Failed to send email', error);
    }
  }

  /**
   * Build email payload with attachments
   */
  private buildEmailPayload(screenshot: Buffer, errorScreenshot?: Buffer): EmailPayload {
    const attachments: EmailAttachment[] = [
      {
        filename: generateDateFilename(EMAIL_CONFIG.SCREENSHOT_FILENAME_PREFIX, 'png'),
        content: screenshot.toString('base64'),
      },
    ];

    if (errorScreenshot) {
      attachments.push({
        filename: EMAIL_CONFIG.ERROR_SCREENSHOT_FILENAME,
        content: errorScreenshot.toString('base64'),
      });
    }

    return {
      from: this.config.senderEmail,
      to: [this.config.recipientEmail],
      subject: `${EMAIL_CONFIG.SUBJECT_PREFIX} - ${formatDatePT()}`,
      html: this.buildEmailBody(),
      attachments,
    };
  }

  /**
   * Build HTML email body
   */
  private buildEmailBody(): string {
    return `
      <h3>Atualização AIMA</h3>
      <p>Segue em anexo o screenshot da página AIMA.</p>
      <p><strong>Data:</strong> ${formatDateTimePT()}</p>
      <hr>
      <small>Este email foi enviado automaticamente.</small>
    `;
  }

  /**
   * Send email via Resend API
   */
  private async send(payload: EmailPayload): Promise<string> {
    const { data, error } = await this.resend.emails.send({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      attachments: payload.attachments,
    });

    if (error) {
      throw new EmailError(`Resend API error: ${error.message}`);
    }

    if (!data?.id) {
      throw new EmailError('No email ID returned from Resend');
    }

    return data.id;
  }
}
