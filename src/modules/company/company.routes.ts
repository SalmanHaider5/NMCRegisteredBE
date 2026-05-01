import { Router } from 'express';
import { CompanyController } from './company.controller';
import { authenticate } from '../../middlewares';

const router = Router();

router.post('/add', authenticate, CompanyController.create);

export default router;