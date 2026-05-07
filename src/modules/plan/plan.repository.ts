import { prisma } from '../../lib/prisma';
import { Plans } from './plan.types';
export const PlanRepository = {
  get: async () => {
    return prisma.plan.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        key: true,
        name: true,
        currency: true,
        interval: true,
        price: true,
      },
    });
  },

  sync: async (plans: Plans) => {
    await prisma.$transaction(async (tx) => {
      await tx.plan.deleteMany({});
      await tx.plan.createMany({
        data: plans,
      });
    });
  },

  getById: async (id: number) => {
    return prisma.plan.findUnique({
      where: { id },
    });
  },

  getByStripePriceId: async (stripePriceId: string) => {
    return prisma.plan.findFirst({
      where: { stripePriceId },
    });
  },
};
