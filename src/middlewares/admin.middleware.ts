import { Request, Response, NextFunction } from 'express';

export const validateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const key = req.headers['x-admin-key'];
    if (!key || key !== process.env.X_ADMIN_KEY) {
      return res.status(403).json({ message: 'Access Forbidden' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid key' });
  }
};
