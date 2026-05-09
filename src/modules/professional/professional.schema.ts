import { z } from 'zod';

export const createProfessionalSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
  postCode: z.string(),
  address: z.string(),
  city: z.string().optional(),
  county: z.string().optional(),
  nmcPin: z.string(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  status: z.string().optional(),
  distance: z.number().optional(),
  cpdHours: z.number().optional(),
  hasTransport: z.boolean().optional(),
});

export const updateProfessionalSchema = createProfessionalSchema.partial();

export const toggle2FASchema = z.object({
  twoFactorAuthentication: z.boolean(),
  code: z.string(),
});

export const searchSchema = z.object({
  page: z.number(),
  limit: z.number(),
});
