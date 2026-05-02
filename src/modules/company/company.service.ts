import { CompanyRepository } from './company.repository';
import { AppError } from '../../utils';
import { MESSAGES } from '../../constants';
import { CompanyPayload, UpdateCompanyPayload } from './company.types';

export class CompanyService {
  static async createCompany(data: CompanyPayload) {
    const existing = await CompanyRepository.findById(data.userId);
    if (existing) {
      throw new AppError(MESSAGES.USER_EXISTS, 409);
    }
    const company = await CompanyRepository.create(data);
    return company;
  }

  static async updateCompany(userId: number, data: UpdateCompanyPayload) {
    await CompanyRepository.updateByUserId(userId, data);
    return {
      message: MESSAGES.PROFILE_UPDATED,
      data,
    };
  }
}
