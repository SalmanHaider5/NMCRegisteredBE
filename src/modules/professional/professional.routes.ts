import { Router } from 'express';
import { ProfessionalController } from './professional.controller';
import {
  authenticate,
  validateRequest,
  uploadProfessionalFiles,
  verifyOtp,
} from '../../middlewares';
import {
  createProfessionalSchema,
  toggle2FASchema,
  updateProfessionalSchema,
} from './professional.schema';

const router = Router();

router.post(
  '/create',
  authenticate,
  uploadProfessionalFiles,
  validateRequest(createProfessionalSchema),
  ProfessionalController.createProfile,
);

router.post(
  '/2fa',
  authenticate,
  validateRequest(toggle2FASchema),
  verifyOtp,
  ProfessionalController.toggle2FA,
);

router.put(
  '/update',
  authenticate,
  validateRequest(updateProfessionalSchema),
  ProfessionalController.updateProfile,
);

export default router;
