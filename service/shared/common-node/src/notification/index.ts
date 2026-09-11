/**
 * Notification — send alerts via Console, Email, or Webhook.
 *
 * Usage:
 *   import { notifier, Notifier, ConsoleNotifier, EmailNotifier, WebhookNotifier } from '@verveai/common-node';
 *
 *   // Use the default console notifier
 *   await notifier.notify({ type: 'TEACHER_NOTE', payload: { studentId, note } });
 *
 *   // Or create specific notifiers
 *   const email = new EmailNotifier({ smtpUrl: process.env.SMTP_URL });
 *   await email.send({ to: 'admin@school.vn', subject: 'New intervention', body: '...' });
 *
 * @module notification
 */

export enum NotificationType {
  TEACHER_NOTE = 'TEACHER_NOTE',
  INTERVENTION_CREATED = 'INTERVENTION_CREATED',
  INTERVENTION_RESOLVED = 'INTERVENTION_RESOLVED',
  REVIEW_APPROVED = 'REVIEW_APPROVED',
  REVIEW_REJECTED = 'REVIEW_REJECTED',
  BUNDLE_SIGNED = 'BUNDLE_SIGNED',
  SYNC_CONFLICT = 'SYNC_CONFLICT',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  STUDENT_PROGRESS_WARNING = 'STUDENT_PROGRESS_WARNING',
}

export interface NotificationPayload {
  type: NotificationType;
  payload: Record<string, unknown>;
  timestamp?: string;
  source?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Notifier interface — implement to add new channels.
 */
export interface Notifier {
  /** Send a notification. Returns true on success. */
  notify(payload: NotificationPayload): Promise<NotificationResult>;
  /** Check if this notifier is configured/enabled. */
  isEnabled(): boolean;
}

// ─── Console Notifier ──────────────────────────────────────────────────────────

/**
 * Prints notifications to stdout (dev/staging).
 */
export class ConsoleNotifier implements Notifier {
  private readonly prefix: string;

  constructor(prefix = '[NOTIFICATION]') {
    this.prefix = prefix;
  }

  isEnabled(): boolean {
    return true; // Always available
  }

  async notify(payload: NotificationPayload): Promise<NotificationResult> {
    const timestamp = payload.timestamp ?? new Date().toISOString();
    const lines = [
      `${this.prefix} ${timestamp}`,
      `  Type: ${payload.type}`,
      `  Source: ${payload.source ?? 'unknown'}`,
      `  Payload: ${JSON.stringify(payload.payload, null, 2)}`,
    ];
    console.log(lines.join('\n'));
    return { success: true, messageId: `console-${Date.now()}` };
  }
}

// ─── Email Notifier ───────────────────────────────────────────────────────────

export interface EmailOptions {
  smtpUrl?: string;
  from?: string;
  defaultTo?: string;
}

/**
 * Sends notifications via SMTP (nodemailer-compatible URL).
 */
export class EmailNotifier implements Notifier {
  private readonly smtpUrl: string | undefined;
  private readonly from: string;
  private readonly defaultTo: string | undefined;

  constructor(options: EmailOptions = {}) {
    this.smtpUrl = options.smtpUrl ?? process.env['SMTP_URL'];
    this.from = options.from ?? process.env['EMAIL_FROM'] ?? 'noreply@verveai.com';
    this.defaultTo = options.defaultTo ?? process.env['EMAIL_TO'];
  }

  isEnabled(): boolean {
    return Boolean(this.smtpUrl);
  }

  async notify(payload: NotificationPayload): Promise<NotificationResult> {
    if (!this.isEnabled()) {
      return { success: false, error: 'EmailNotifier is disabled (no SMTP_URL)' };
    }

    try {
      // Lazy import nodemailer to avoid hard dep
      const nodemailer = await import('nodemailer');
      const transport = nodemailer.createTransport(this.smtpUrl);

      const to = (payload.payload['email'] as string | undefined) ?? this.defaultTo;
      if (!to) {
        return { success: false, error: 'No recipient email provided' };
      }

      const info = await transport.sendMail({
        from: this.from,
        to,
        subject: `[VERVEAI] ${payload.type}`,
        text: this.formatText(payload),
        html: this.formatHtml(payload),
      });

      return { success: true, messageId: info.messageId };
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      console.error(`[EmailNotifier] Failed to send email: ${err}`);
      return { success: false, error: err };
    }
  }

  private formatText(payload: NotificationPayload): string {
    return [
      `Type: ${payload.type}`,
      `Time: ${payload.timestamp ?? new Date().toISOString()}`,
      `Source: ${payload.source ?? 'unknown'}`,
      '',
      'Details:',
      JSON.stringify(payload.payload, null, 2),
    ].join('\n');
  }

  private formatHtml(payload: NotificationPayload): string {
    const rows = Object.entries(payload.payload)
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${String(v)}</td></tr>`)
      .join('');
    return `
      <h2>VERVEAI Notification</h2>
      <table>
        <tr><td><strong>Type</strong></td><td>${payload.type}</td></tr>
        <tr><td><strong>Time</strong></td><td>${payload.timestamp ?? new Date().toISOString()}</td></tr>
        <tr><td><strong>Source</strong></td><td>${payload.source ?? 'unknown'}</td></tr>
        ${rows}
      </table>
    `;
  }
}

// ─── Webhook Notifier ──────────────────────────────────────────────────────────

export interface WebhookOptions {
  url: string;
  secret?: string;
  headers?: Record<string, string>;
}

/**
 * POSTs notifications to a webhook endpoint.
 */
export class WebhookNotifier implements Notifier {
  private readonly url: string;
  private readonly secret?: string;
  private readonly headers: Record<string, string>;

  constructor(options: WebhookOptions) {
    this.url = options.url ?? process.env['WEBHOOK_URL'] ?? '';
    this.secret = options.secret ?? process.env['WEBHOOK_SECRET'];
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  isEnabled(): boolean {
    return Boolean(this.url);
  }

  async notify(payload: NotificationPayload): Promise<NotificationResult> {
    if (!this.isEnabled()) {
      return { success: false, error: 'WebhookNotifier is disabled (no URL)' };
    }

    try {
      const body = JSON.stringify({
        ...payload,
        timestamp: payload.timestamp ?? new Date().toISOString(),
      });

      const headers: Record<string, string> = { ...this.headers };
      if (this.secret) {
        // HMAC-SHA256 signature
        const crypto = await import('crypto');
        const sig = crypto.createHmac('sha256', this.secret).update(body).digest('hex');
        headers['X-VerveAI-Signature'] = sig;
      }

      const res = await fetch(this.url, {
        method: 'POST',
        headers,
        body,
      });

      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
      }

      return { success: true, messageId: `webhook-${Date.now()}` };
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      console.error(`[WebhookNotifier] Failed to POST webhook: ${err}`);
      return { success: false, error: err };
    }
  }
}

// ─── Default notifier (singleton) ─────────────────────────────────────────────

let _notifier: Notifier = new ConsoleNotifier();

/**
 * Set the default notifier used by `notifier.notify()`.
 */
export function setNotifier(n: Notifier): void {
  _notifier = n;
}

/**
 * Get the default notifier (must call setNotifier first in production).
 */
export function getNotifier(): Notifier {
  return _notifier;
}

/**
 * Convenience — notify using the default notifier.
 */
export async function notify(payload: NotificationPayload): Promise<NotificationResult> {
  return _notifier.notify(payload);
}
