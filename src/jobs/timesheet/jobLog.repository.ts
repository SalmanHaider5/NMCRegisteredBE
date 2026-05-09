import { prisma } from '../../lib/prisma';

export const JobLogRepository = {
  create: (jobName: string) => {
    return prisma.jobLog.create({
      data: {
        jobName,
        status: 'RUNNING',
      },
    });
  },

  markSuccess: (id: number, processed: number) => {
    return prisma.jobLog.update({
      where: { id },
      data: {
        status: 'SUCCESS',
        endedAt: new Date(),
        processed,
      },
    });
  },

  markFailed: (id: number, error: string) => {
    return prisma.jobLog.update({
      where: { id },
      data: {
        status: 'FAILED',
        endedAt: new Date(),
        error,
      },
    });
  },
};
