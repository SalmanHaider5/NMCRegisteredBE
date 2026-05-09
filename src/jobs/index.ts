import { registerCronJob } from '../utils/cronRunner';
import { runTimesheetExpiry } from './timesheet/timesheet.service';

export const initJobs = () => {
  registerCronJob({
    name: 'Timesheet Expiry',
    schedule: '0 0 * * *',
    task: async () => {
      await runTimesheetExpiry();
    },
  });
};
