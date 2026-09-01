import { Resend } from 'resend';
import { env } from '../../config/env';

const resendClient = env.resend.isConfigured ? new Resend(env.resend.apiKey) : null;

/**
 * Sends a one-time verification code by email via Resend.
 *
 * Falls back to logging the code to the server console when RESEND_API_KEY
 * isn't configured, so the login/signup flow still works end-to-end in
 * development without a real Resend account.
 */
export async function sendOtpEmail(to: string, code: string): Promise<void> {
  if (!resendClient) {
    // eslint-disable-next-line no-console
    console.warn(`[mailer] RESEND_API_KEY not set — OTP for ${to}: ${code} (not emailed, dev fallback)`);
    return;
  }

  const { error } = await resendClient.emails.send({
    from: env.resend.fromEmail,
    to,
    subject: 'Your Vinit Textiles verification code',
    html: `
      <div style="font-family: Georgia, serif; color: #3E150B; max-width: 420px; margin: 0 auto;">
        <p style="font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #C9972E;">Vinit Textiles</p>
        <h1 style="font-size: 20px; margin: 8px 0 20px;">Your verification code</h1>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 0.3em; margin: 0 0 20px;">${code}</p>
        <p style="font-size: 13px; color: #6b3410;">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[mailer] Resend failed to send OTP email', error);
    throw new Error('Failed to send verification email');
  }
}
