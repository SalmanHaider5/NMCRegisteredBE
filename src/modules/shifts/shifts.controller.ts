import { Request, Response } from 'express';
import { ShiftService } from './shifts.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';

export class ShiftsController {
  static getShifts = asyncHandler(async (req: Request, res: Response) => {
    const result = await ShiftService.getAllShifts();
    res.status(200).json(ApiResponseUtil.success(result.message, result.data));
  });
}
