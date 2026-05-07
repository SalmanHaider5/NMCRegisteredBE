import { z } from 'zod';

export const createTimesheetSchema = z.object({
  timesheet: z.object({
    startingDay: z.coerce.date(),
    endingDay: z.coerce.date(),
  }),
  timesheetEntries: z.array(
    z.object({
      date: z.coerce.date(),
      shiftId: z.number().nullable(),
      status: z.boolean(),
    }),
  ),
});

export const updateShift = z.object({
  shiftId: z.number(),
  status: z.boolean(),
});
