import { Router } from 'express';
import { UserController } from './user.controller';
import {
  validateRequest,
  authenticate,
  verifyPassword,
} from '../../middlewares';
import { signupSchema, changePasswordSchema } from './user.schema';

const router = Router();

router.post(
  '/signup',
  validateRequest(signupSchema),
  UserController.createUser,
);

router.get('/:userId/verify/:token', UserController.verifyUser);

router.post(
  '/changePassword',
  authenticate,
  validateRequest(changePasswordSchema),
  verifyPassword,
  UserController.updatePassword,
);

export default router;
