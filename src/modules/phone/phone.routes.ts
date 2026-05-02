import { Router } from 'express';
import { PhoneController } from './phone.controller';
import { authenticate, validateRequest } from '../../middlewares';
import { phoneSchema, verifyPhoneSchema } from './phone.schema';

const router = Router();

router.post(
  '/add',
  authenticate,
  validateRequest(phoneSchema),
  PhoneController.addPhone,
);

router.post(
  '/verify',
  authenticate,
  validateRequest(verifyPhoneSchema),
  PhoneController.verifyPhone,
);

router.post(
  '/change',
  authenticate,
  validateRequest(phoneSchema),
  PhoneController.updatePhone,
);

router.get('/generateOTP', authenticate, PhoneController.generateOTP);

export default router;
