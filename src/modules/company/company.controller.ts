import { Request, Response } from 'express';
import { CompanyService } from './company.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';
import { MESSAGES } from '../../constants';

export class CompanyController {

  static create = asyncHandler(async (req: Request, res: Response) => {
    const company = await CompanyService.createCompany(req.body);
      return res.status(201).json(
        ApiResponseUtil.success(MESSAGES.COMPANY_CREATED, company)
      );
  });     
}