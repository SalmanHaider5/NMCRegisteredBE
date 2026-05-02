import { z } from 'zod';

export const phoneSchema = z.object({
  phone: z.string(),
});

export const verifyPhoneSchema = z.object({
  code: z.string(),
});
