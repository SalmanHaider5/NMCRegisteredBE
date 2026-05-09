import { Router } from 'express';
import { TimesheetController } from './timesheet.controller';
import { authenticate, validateRequest } from '../../middlewares';
import { createTimesheetSchema, updateShift } from './timesheet.schema';

const router = Router();

router.post(
  '/add',
  authenticate,
  validateRequest(createTimesheetSchema),
  TimesheetController.addTimesheet,
);

router.get('/list', authenticate, TimesheetController.fetchTimesheets);
router.get(
  '/search/:userId',
  authenticate,
  TimesheetController.fetchTimesheetsByUserId,
);
router.get('/:id', authenticate, TimesheetController.fetchTimesheet);

router.put(
  '/shifts/:id',
  authenticate,
  validateRequest(updateShift),
  TimesheetController.updateShift,
);

router.delete('/:id', authenticate, TimesheetController.removeTimesheet);

export default router;
