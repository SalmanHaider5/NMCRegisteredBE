import { TimesheetRepository } from './timesheet.repository';

export const runTimesheetExpiry = async (): Promise<{ processed: number }> => {
  const expired = await TimesheetRepository.findExpired();

  if (expired.length === 0) {
    return { processed: 0 };
  }

  await TimesheetRepository.markExpired(expired.map((t) => t.id));

  return {
    processed: expired.length,
  };
};
