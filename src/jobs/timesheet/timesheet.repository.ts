import { prisma } from '../../lib/prisma';

export const TimesheetRepository = {
  findExpired: async () => {
    return prisma.timesheet.findMany({
      where: {
        endingDay: {
          lt: new Date(),
        },
        isExpired: false,
      },
    });
  },

  markExpired: async (ids: number[]) => {
    return prisma.timesheet.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isExpired: true,
      },
    });
  },
};
