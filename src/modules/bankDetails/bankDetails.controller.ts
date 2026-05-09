import { Request, Response } from 'express';
import { BankDetailsService } from './bankDetails.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';

export class BankDetailsController {
  static add = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const payload = {
      ...req.body,
      userId,
    };
    const result = await BankDetailsService.addBankDetails(payload);
    return res
      .status(201)
      .json(ApiResponseUtil.success(result.message, result.data));
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const payload = req.body;
    const response = await BankDetailsService.updateBankDetails(
      userId,
      payload,
    );
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });
}
