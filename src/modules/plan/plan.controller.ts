import { Request, Response } from 'express';
import { PlanService } from './plan.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';

export class PlanController {
  static getPlans = asyncHandler(async (req: Request, res: Response) => {
    const result = await PlanService.getAllPlans();
    res.status(200).json(ApiResponseUtil.success(result.message, result.data));
  });

  static syncPlans = asyncHandler(async (req: Request, res: Response) => {
    const result = await PlanService.syncPlans();
    res.status(200).json(ApiResponseUtil.success(result.message, result.data));
  });
}
