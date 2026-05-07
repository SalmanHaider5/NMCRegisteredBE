import { prisma } from '../../lib/prisma';

export const ShiftRepository = {
  get: async () => {
    return prisma.shift.findMany({
      select: {
        id: true,
        key: true,
        name: true,
        startTime: true,
        endTime: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  },
};
