import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middlewares';
import { signupSchema } from './user.schema'; 

const router = Router();

router.post(
  '/signup',
  validateRequest(signupSchema),
  UserController.createUser
);

router.get(
  '/:userId/verify/:token',
  UserController.verifyUser
);

export default router;