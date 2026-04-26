import bcrypt from 'bcrypt';
import { UserRole, User } from '@prisma/client';
import { MESSAGES } from '../../constants';
import { TokenRepository } from '../token/token.repository';
import { TokenService } from '../token/token.service';
import { UserRepository } from './user.repository';
import { auth } from '../../config';
import { EmailService } from '../../services/email/email.service';
import { AppError, logger, isActivationLinkExpired } from '../../utils';

export class UserService {

  private static async sendVerificationEmail(email: string, token: string, userId?: number) {
    return EmailService.sendVerificationEmail(email, token, userId);
  }

  private static async handleExistingUser(user: User) {
    if (user.isVerified) {
      return {
        message: MESSAGES.USER_EXISTS,
        data: {},
      };
    }
    const token = TokenService.generateVerificationToken();
    await TokenRepository.upsert({
      userId: user.id,
      token,
      expiresAt: auth.tokenExpirationHours,
    });
    await this.sendVerificationEmail(user.email, token, user.id);

    return {
      message: MESSAGES.VERIFICATION_EMAIL_SENT,
      data: {},
    };
  }

  private static async handleNewUser(data: {
    email: string;
    password: string;
    role: 'company' | 'professional';
  }) {
    const user = await UserRepository.createUser({
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      role: data.role.toUpperCase() as UserRole
    });
    const token = TokenService.generateVerificationToken();
    await TokenRepository.create({
      userId: user.id,
      token,
      expiresAt: auth.tokenExpirationHours,
    });
    await this.sendVerificationEmail(user.email, token, user.id);
    return {
      message: MESSAGES.ACCOUNT_CREATED,
      data: {},
    };
  }

  static async createUser(data: {
    email: string;
    password: string;
    role: 'company' | 'professional';
  }) {
    const { email, password, role } = data;
    const isExistingUser = await UserRepository.findByEmail(email);
    if (isExistingUser) {
      return await this.handleExistingUser(isExistingUser);
    }
    return await this.handleNewUser({ email, password, role });
  }

  static async verifyUser(params: { userId: number; token: string }) {
    const { userId, token: reqToken } = params;
    const user = await UserRepository.findById(Number(userId));

    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (user.isVerified) {
      return {
        message: MESSAGES.USER_ALREADY_VERIFIED,
        data: null
      };
    }

    const userToken = await TokenRepository.findByUserId(user.id);

    if (!userToken) {
      throw new AppError(MESSAGES.INVALID_TOKEN_REQUEST, 400);
    }

    if (userToken.token !== reqToken) {
      throw new AppError(MESSAGES.INVALID_TOKEN_REQUEST, 400);
    }

    if (isActivationLinkExpired(userToken.expiresAt)) {
      throw new AppError(MESSAGES.INVALID_TOKEN_REQUEST, 400);
    }

    await UserRepository.updateUserById(user.id, {
      isVerified: true
    });

    await TokenRepository.deleteByUserId(user.id);

    logger.info(
      {
        userId: user.id,
        email: user.email
      },
      MESSAGES.ACCOUNT_VERIFIED
    );

    return {
      message: MESSAGES.ACCOUNT_VERIFIED,
      data: {
        userId: user.id,
        role: user.role,
        email: user.email
      }
    };
  }

};