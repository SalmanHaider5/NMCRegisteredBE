import { prisma } from '../../lib/prisma';
import { CreateTimesheetPayload } from './timesheet.types';

export const TimesheetRepository = {
  createTimesheetWithEntries: async (
    userId: number,
    data: CreateTimesheetPayload,
  ) => {
    return prisma.$transaction(async (tx) => {
      const timesheet = await tx.timesheet.create({
        data: {
          startingDay: data.timesheet.startingDay
            ? new Date(data.timesheet.startingDay)
            : null,
          endingDay: data.timesheet.endingDay
            ? new Date(data.timesheet.endingDay)
            : null,
          userId,
        },
      });

      const entries = await Promise.all(
        data.timesheetEntries.map((entry) =>
          tx.timesheetEntries.create({
            data: {
              date: entry.date ? new Date(entry.date) : null,
              shiftId: entry.shiftId,
              status: entry.status ?? false,
              timesheetId: timesheet.id,
            },
          }),
        ),
      );

      return {
        ...timesheet,
        timesheetEntries: entries,
      };
    });
  },

  findByUserId: async (userId: number) => {
    return prisma.timesheet.findMany({
      where: {
        userId,
        isExpired: false,
      },
      orderBy: {
        startingDay: 'asc',
      },
      include: {
        timesheetEntries: {
          include: {
            shift: true,
          },
        },
      },
    });
  },

  findTimesheetShiftsById: async (id: number, userId: number) => {
    return prisma.timesheet.findFirst({
      where: {
        id,
        userId,
        isExpired: false,
      },
      include: {
        timesheetEntries: {
          include: {
            shift: true,
          },
        },
      },
    });
  },

  findTimesheetById: async (id: number, userId: number) => {
    return prisma.timesheetEntries.findFirst({
      where: {
        id,
        timesheet: {
          userId,
        },
      },
    });
  },

  updateShift: async (
    id: number,
    data: {
      shiftId: number;
      status: boolean;
    },
  ) => {
    return prisma.timesheetEntries.update({
      where: {
        id,
      },
      data,
    });
  },

  findById: async (id: number, userId: number) => {
    return prisma.timesheet.findFirst({
      where: { id, userId, isExpired: false },
    });
  },

  removeTimesheet: async (id: number) => {
    return prisma.timesheet.update({
      where: {
        id,
      },
      data: {
        isExpired: true,
      },
    });
  },
};
