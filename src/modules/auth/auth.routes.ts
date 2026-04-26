import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate, validateRequest } from '../../middlewares';
import { loginSchema } from './auth.schema'; 

const router = Router();

router.post(
  '/login',
  validateRequest(loginSchema),
  AuthController.login
);

router.post(
  '/refresh',
  AuthController.refresh
);

router.post(
  '/logout',
  authenticate,
  AuthController.logout
);

export default router;