import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authenticate, validateRequest } from '../../middlewares';
import {
  SubscriptionSchema,
  RemovePaymentMethodSchema,
} from './subscription.schema';

const router = Router();

router.delete(
  '/cancel',
  authenticate,
  SubscriptionController.cancelSubscription,
);
router.post(
  '/init',
  authenticate,
  validateRequest(SubscriptionSchema),
  SubscriptionController.initPayment,
);
router.get(
  '/paymentMethods',
  authenticate,
  SubscriptionController.getPaymentMethods,
);

router.post(
  '/paymentMethod/remove',
  authenticate,
  validateRequest(RemovePaymentMethodSchema),
  SubscriptionController.removePaymentMethod,
);

export default router;
