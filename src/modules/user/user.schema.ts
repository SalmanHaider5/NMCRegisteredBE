import { z } from 'zod';

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(['company', 'professional']),
});

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(6),
  position: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
});

export const verifyLoginSchema = z.object({
  professionalId: z.string(),
  code: z.string().min(4),
});

export const updateEmailSchema = z.object({
  email: z.email(),
});

export const changePasswordSchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6),
});
