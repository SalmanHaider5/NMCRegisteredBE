import { z } from 'zod';

export const createCompanySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organization: z.string().min(1),
  tradingName: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  county: z.string().optional(),
  postalCode: z.string().min(1),
  website: z.url().optional(),
  phone: z.string().min(5),
  registration: z.string().optional(),
  charity: z.boolean().optional(),
  charityReg: z.string().optional(),
  subsidiary: z.boolean().optional(),
  subsidiaryName: z.string().optional(),
  subsidiaryAddress: z.string().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();
