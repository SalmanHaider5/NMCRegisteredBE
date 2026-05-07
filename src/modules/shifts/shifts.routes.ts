import { Router } from 'express';
import { ShiftsController } from './shifts.controller';
import { authenticate } from '../../middlewares';

const router = Router();

router.get('/', authenticate, ShiftsController.getShifts);

export default router;
