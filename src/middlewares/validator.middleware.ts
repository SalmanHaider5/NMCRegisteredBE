import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ERRORS } from '../constants';

export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: ERRORS.VALIDATION_ERROR,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    req.body = result.data;
    next();
  };