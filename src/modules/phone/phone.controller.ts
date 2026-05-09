import { Request, Response } from 'express';
import { PhoneService } from './phone.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';

export class PhoneController {
  static addPhone = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const phone = req.body.phone;
    const payload = { userId, phone };
    const response = await PhoneService.addPhone(payload);
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static verifyPhone = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const code = req.body.code;
    const payload = { userId, code };
    const response = await PhoneService.verifyPhone(payload);
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static updatePhone = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const phone = req.body.phone;
    const payload = { userId, phone };
    const response = await PhoneService.updatePhone(payload);
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static generateOTP = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const payload = { userId };
    const response = await PhoneService.generateOTP(payload);
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });
}
