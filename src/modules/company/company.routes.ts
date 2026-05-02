import { Router } from 'express';
import { CompanyController } from './company.controller';
import { authenticate, validateRequest } from '../../middlewares';
import { createCompanySchema, updateCompanySchema } from './company.schema';

const router = Router();

router.post(
  '/add',
  authenticate,
  validateRequest(createCompanySchema),
  CompanyController.create,
);

router.post(
  '/update',
  authenticate,
  validateRequest(updateCompanySchema),
  CompanyController.updateProfile,
);

export default router;
