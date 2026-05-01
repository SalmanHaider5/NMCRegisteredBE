import { prisma } from '../../lib/prisma';
import { CreateCompanyDTO  } from './company.schema';

export class CompanyRepository {
  static async create(data: CreateCompanyDTO) {
    return prisma.company.create({
      data,
    });
  }

  static async findById(id: number) {
    return prisma.company.findUnique({
      where: { id },
    });
  }

  static async findByUserId(userId: number) {
    return prisma.company.findUnique({
      where: { userId },
    });
  }
}