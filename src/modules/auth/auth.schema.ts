import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  position: z
    .object({
      longitude: z.number().optional(),
      latitude: z.number().optional()
    })
    .optional()
});

export type LoginInput = z.infer<typeof loginSchema>;