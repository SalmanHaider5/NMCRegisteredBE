import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { app } from '../config';

const adapter = new PrismaPg({
  connectionString: app.prismaDbUrl!,
});

export const prisma = new PrismaClient({ adapter });  