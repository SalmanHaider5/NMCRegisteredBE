import { transporter } from './email.provider';
import { email, app } from '../../config';
import { MESSAGES } from '../../constants';

export class EmailService {

  static async sendEmail(to: string, subject: string, html: string) {
    return transporter.sendMail({
      from: email.userEmail,
      to,
      subject,
      html
    });
  }

  static async sendVerificationEmail(to: string, token: string, userId?: number) {
    const link = `${app.baseUrl}/api/users/${userId}/verify/${token}`;

    return this.sendEmail(
      to,
      MESSAGES.VERIFY_YOUR_ACCOUNT,
      `<p>Click below to verify:</p><a href='${link}'>${link}</a>`
    );
  }

  static async sendPasswordResetEmail(to: string, token: string) {
    const link = `${app.baseUrl}/reset-password/${token}`;

    return this.sendEmail(
      to,
      MESSAGES.RESET_PASSWORD,
      `<p>Reset your password:</p><a href='${link}'>${link}</a>`
    );
  }
}