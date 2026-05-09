import { randomBytes } from 'crypto';

export class TokenService {

  static generateVerificationToken() {
    return randomBytes(32).toString('hex');
  }
  
}