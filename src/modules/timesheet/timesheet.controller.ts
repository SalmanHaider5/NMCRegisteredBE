import { Request, Response } from 'express';
import { TimesheetService } from './timesheet.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';
import { UpdateShiftPayload } from './timesheet.types';

export class TimesheetController {
  static addTimesheet = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.user?.id as number;
    const response = await TimesheetService.addTimesheet(userId, payload);
    res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static fetchTimesheets = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const response = await TimesheetService.fetchTimesheets(userId);
    res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static fetchTimesheetsByUserId = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.params?.userId as string;
      const response = await TimesheetService.fetchTimesheets(Number(userId));
      res
        .status(200)
        .json(ApiResponseUtil.success(response.message, response.data));
    },
  );

  static fetchTimesheet = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const id = req.params?.id as string;
    const response = await TimesheetService.findTimesheetById(
      Number(id),
      userId,
    );
    res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static updateShift = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const id = req.params?.id as string;
    const payload = req.body as UpdateShiftPayload;
    const response = await TimesheetService.updateShift(
      Number(id),
      userId,
      payload,
    );
    res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static removeTimesheet = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const id = req.params?.id as string;
    const response = await TimesheetService.remove(Number(id), userId);
    res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });
}
