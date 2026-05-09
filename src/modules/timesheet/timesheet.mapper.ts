import { TimesheetWithEntries } from './timesheet.types';

export const mapTimesheet = (timesheet: TimesheetWithEntries) => {
  return {
    id: timesheet.id,
    startingDay: timesheet.startingDay,
    endingDay: timesheet.endingDay,
    shifts: timesheet.timesheetEntries.map((entry) => {
      return {
        id: entry.id,
        date: entry.date,
        ...(entry.shift?.key ? { key: entry.shift?.key } : {}),
        ...(entry.shift?.name ? { name: entry.shift?.name } : {}),
        ...(entry.shift?.startTime
          ? { startTime: entry.shift?.startTime }
          : {}),
        ...(entry.shift?.endTime ? { endTime: entry.shift?.endTime } : {}),
        status: entry.status ?? false,
      };
    }),
  };
};

export const mapTimesheets = (data: TimesheetWithEntries[]) => {
  return data.map(mapTimesheet);
};
