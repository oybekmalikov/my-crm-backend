import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Thin wrapper around nodemailer, configured from the SMTP_* env vars that
 * are already validated (as optional) in env.validation.ts.
 *
 * If SMTP is not configured (e.g. local dev without credentials), emails are
 * logged instead of sent so the rest of the flow (password reset, payment
 * receipts, reminders) can still be exercised without crashing.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter | null {
    if (this.transporter) return this.transporter;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    if (!host || !user || !pass) {
      return null;
    }
    this.transporter = nodemailer.createTransport({
      host,
      port: port ? Number(port) : 587,
      secure: Number(port) === 465,
      auth: { user, pass },
    });
    return this.transporter;
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn(
        `SMTP not configured — skipping email to ${to}: "${subject}"`,
      );
      return;
    }
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      // Never let a transient email failure break the caller's business
      // flow (e.g. a payment being recorded, or a password reset request
      // that must return the same response whether or not the email
      // address exists).
      this.logger.error(`Failed to send email to ${to}: ${error}`);
    }
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    const host = process.env.API_HOST || 'http://localhost:5000';
    const resetUrl = `${host}/reset-password?token=${resetToken}`;
    await this.sendMail(
      to,
      'Password reset request',
      `<p>We received a request to reset your password.</p>
       <p>Use the token below (valid for 30 minutes):</p>
       <p><code>${resetToken}</code></p>
       <p>Or open this link: <a href="${resetUrl}">${resetUrl}</a></p>
       <p>If you did not request this, you can safely ignore this email.</p>`,
    );
  }
}
