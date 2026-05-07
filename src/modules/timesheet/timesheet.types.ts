import { Timesheet, TimesheetEntries, Shift } from '@prisma/client';

export interface CreateTimesheetPayload {
  timesheet: {
    startingDay: Date;
    endingDay: Date;
  };
  timesheetEntries: {
    date: Date;
    shiftId: number;
    status: boolean;
  }[];
}

export type TimesheetWithEntries = Timesheet & {
  timesheetEntries: (TimesheetEntries & {
    shift: Shift | null;
  })[];
};

export type UpdateShiftPayload = {
  shiftId: number;
  status: boolean;
};
