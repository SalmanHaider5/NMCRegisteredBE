import { Router } from 'express';
import { CompanyController } from './company.controller';
import { authenticate, validateRequest } from '../../middlewares';
import { createCompanySchema } from './company.schema';

const router = Router();

router.post(
  '/add',
  authenticate,
  validateRequest(createCompanySchema),
  CompanyController.create,
);

export default router;
