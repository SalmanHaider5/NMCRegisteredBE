import { z } from 'zod';

export const TokenTypeEnum = z.enum([
  'VERIFY_EMAIL',
  'RESET_PASSWORD',
  'LOGIN'
]);

export const tokenBaseSchema = z.object({
  userId: z.number().int().positive(),
  token: z.string().min(10),
  type: TokenTypeEnum,
  expiresAt: z.date()
});

export const createTokenSchema = tokenBaseSchema;

export const verifyTokenSchema = z.object({
  token: z.string().min(10),
  type: TokenTypeEnum
});

export const resendTokenSchema = z.object({
  email: z.email(),
  type: TokenTypeEnum
});