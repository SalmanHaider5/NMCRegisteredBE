import { Router } from 'express';
import { PlanController } from './plan.controller';
import { authenticate, validateAdmin } from '../../middlewares';

const router = Router();

router.get('/list', authenticate, PlanController.getPlans);
router.get('/sync', validateAdmin, PlanController.syncPlans);

export default router;
