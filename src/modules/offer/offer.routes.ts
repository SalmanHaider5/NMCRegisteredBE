import { Router } from 'express';
import { OfferController } from './offer.controller';
import { authenticate, validateRequest } from '../../middlewares';
import { offerSchema, updateOfferSchema } from './offer.schema';

const router = Router();

router.post(
  '/create',
  authenticate,
  validateRequest(offerSchema),
  OfferController.createOffer,
);

router.put(
  '/update',
  authenticate,
  validateRequest(updateOfferSchema),
  OfferController.update,
);

export default router;
