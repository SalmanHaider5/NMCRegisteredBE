import { MESSAGES } from '../../constants';
import { TimesheetRepository } from './timesheet.repository';
import { CreateTimesheetPayload, UpdateShiftPayload } from './timesheet.types';
import { mapTimesheets, mapTimesheet } from './timesheet.mapper';
import { AppError } from '../../utils';

export const TimesheetService = {
  addTimesheet: async (userId: number, body: CreateTimesheetPayload) => {
    const result = await TimesheetRepository.createTimesheetWithEntries(
      userId,
      body,
    );
    return {
      message: MESSAGES.TIMESHEET_CREATED,
      data: result,
    };
  },

  fetchTimesheets: async (userId: number) => {
    const result = await TimesheetRepository.findByUserId(userId);
    const mappedTimesheets = mapTimesheets(result);
    return {
      message: MESSAGES.TIMESHEETS,
      data: mappedTimesheets,
    };
  },

  findTimesheetById: async (id: number, userId: number) => {
    const timesheet = await TimesheetRepository.findTimesheetShiftsById(
      id,
      userId,
    );
    const mappedTimesheet = timesheet ? mapTimesheet(timesheet) : {};
    return {
      message: MESSAGES.TIMESHEETS,
      data: mappedTimesheet,
    };
  },

  updateShift: async (
    id: number,
    userId: number,
    payload: UpdateShiftPayload,
  ) => {
    const timesheet = await TimesheetRepository.findTimesheetById(id, userId);
    if (!timesheet) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    const response = await TimesheetRepository.updateShift(id, payload);
    return {
      message: MESSAGES.TIMESHEETS,
      data: response,
    };
  },

  remove: async (id: number, userId: number) => {
    const timesheet = await TimesheetRepository.findById(id, userId);
    if (!timesheet) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    await TimesheetRepository.removeTimesheet(id);
    return {
      message: MESSAGES.TIMESHEET_REMOVED,
      data: null,
    };
  },
};
