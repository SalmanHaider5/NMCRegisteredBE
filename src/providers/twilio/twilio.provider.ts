import { SmsProvider } from '../provider.interface';
import { twilioClient as client, phoneNumber } from '../../config';

export class TwilioProvider implements SmsProvider {
  async send(phone: string, message: string) {
    await client.messages.create({
      body: message,
      from: phoneNumber,
      to: phone,
    });
  }
}
