import { CompanyRepository } from './company.repository';
import { CreateCompanyDTO } from './company.schema';
import { AppError } from '../../utils';
import { MESSAGES } from '../../constants'; 

export class CompanyService {

  static async createCompany(data: CreateCompanyDTO) {
    const existing = await CompanyRepository.findById(data.userId);

    if (existing) {
      throw new AppError(MESSAGES.USER_EXISTS, 409);
    }
    const company = await CompanyRepository.create(data);
    return company;
  }
}