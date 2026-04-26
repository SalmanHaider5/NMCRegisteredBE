import { UserRole } from '@prisma/client';

export interface JwtUserPayload {
  id: number;
  email: string;
  role: UserRole;
}