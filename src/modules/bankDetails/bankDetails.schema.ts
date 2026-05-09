import { z } from 'zod';

export const addBankDetailsSchema = z.object({
  insurance: z.string().optional(),
  sortCode: z.string().optional(),
  accountNumber: z.string(),
});

export const updateBankDetailsSchema = addBankDetailsSchema.partial();
