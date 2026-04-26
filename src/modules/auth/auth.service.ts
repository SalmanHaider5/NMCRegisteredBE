import bcrypt from 'bcrypt';
import { UserRepository } from '../user/user.repository';
import { AppError } from '../../utils';
import { AuthSessionService } from './auth.session.service';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../../utils/jwt';
import { MESSAGES } from '../../constants';

export class AuthService {

  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, 404);
    }
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await AuthSessionService.set(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: payload
    };
  }

  static async refresh(userId: number, token: string) {
    const stored = await AuthSessionService.get(userId);
    if (!stored || stored !== token) {
      throw new AppError('Invalid refresh token', 401);
    }
    const decoded = verifyRefreshToken(token);
    const payload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    await AuthSessionService.set(userId, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  static async logout(userId: number) {
    await AuthSessionService.remove(userId);
    return true;
  }
}