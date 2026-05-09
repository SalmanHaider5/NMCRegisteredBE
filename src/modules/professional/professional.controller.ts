import { Request, Response } from 'express';
import { ProfessionalService } from './professional.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';
import { ProfessionalFiles } from './professional.types';

export class ProfessionalController {
  static createProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const payload = req.body;
    const files = req.files as ProfessionalFiles;
    const response = await ProfessionalService.createProfessional(
      userId,
      payload,
      files,
    );
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static toggle2FA = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const payload = {
      userId,
      twoFactorAuthentication: req.body.twoFactorAuthentication,
    };
    const response = await ProfessionalService.toggle2FA(payload);
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });

  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as number;
    const payload = req.body;
    const response = await ProfessionalService.updateProfile(userId, payload);
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });
  static search = asyncHandler(async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      qualification: req.query.qualification,
    };
    const response = await ProfessionalService.searchProfiles(payload);
    return res
      .status(200)
      .json(ApiResponseUtil.success(response.message, response.data));
  });
}
