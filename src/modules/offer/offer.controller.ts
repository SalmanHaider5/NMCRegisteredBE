import { Request, Response } from 'express';
import { OfferService } from './offer.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';

export class OfferController {
  static createOffer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const payload = req.body;
    const response = await OfferService.createOffer(userId, payload);
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const role = req.user?.role as string;
    const payload = req.body;
    let response: { message: string; data: unknown };
    if (role === 'company') {
      response = await OfferService.updateOfferByCompany(payload);
    } else {
      response = await OfferService.updateOfferByProfessional(payload);
    }
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });
}
