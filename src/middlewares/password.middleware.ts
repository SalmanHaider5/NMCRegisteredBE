import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../modules/user/user.repository';
import { isPasswordValid } from '../modules/user/user.helpers';
import { AppError, logger } from '../utils';
import { MESSAGES } from '../constants';

export const verifyPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;
    if (!userId || !password) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, 400);
    }
    const user = await UserRepository.findById(userId);
    if (!user || !user.password) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    const isValid = isPasswordValid(password, user.password);

    if (!isValid) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, 400);
    }
    req.user = user;

    next();
  } catch (err: unknown) {
    logger.error(err);
    const message =
      err instanceof Error ? err.message : 'Internal Server Error';
    throw new AppError(message, 400);
  }
};
