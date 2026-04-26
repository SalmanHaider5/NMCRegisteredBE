import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError as CustomAppError } from '../utils'; 

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error = err instanceof Error ? err : new Error('Unknown error');

  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body
  });

  if (err instanceof CustomAppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};