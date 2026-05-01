import { z } from 'zod';

export const SubscriptionSchema = z.object({
  planId: z.string(),
});

export const RemovePaymentMethodSchema = z.object({
  paymentMethod: z.string(),
});
