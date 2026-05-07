import { z } from 'zod';

export const offerSchema = z.object({
  professionalId: z.number(),
  shiftRate: z.number().optional(),
  address: z.string().optional(),
  shifts: z.string(),
  message: z.string().optional(),
  professionalMsg: z.string().optional(),
});

export const updateOfferSchema = z.object({
  offerId: z.number(),
  status: z.string(),
});
