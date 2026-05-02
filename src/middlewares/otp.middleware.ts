import { Request, Response, NextFunction } from 'express';
import { PhoneRepository } from '../modules/phone/phone.repository';
import { AppError, logger } from '../utils';
import { MESSAGES } from '../constants';

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { code } = req.body;
    if (!userId || !code) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    const phone = await PhoneRepository.findByUserId(userId);
    if (!phone) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    if (!phone.status) {
      throw new AppError(MESSAGES.PHONE_NOT_VERIFIED, 400);
    }

    const isExpired =
      new Date().getTime() - new Date(phone.updatedAt).getTime() >
      5 * 60 * 1000;

    if (isExpired) {
      throw new AppError(MESSAGES.OTP_EXPIRED, 409);
    }

    if (phone.code !== code) {
      throw new AppError(MESSAGES.INAVLID_CODE, 400);
    }
    next();
  } catch (err: unknown) {
    logger.error(err);
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    throw new AppError(message, 400);
  }
};
