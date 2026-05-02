import { prisma } from '../../lib/prisma';
import { UpdateCompanyPayload, CompanyPayload } from './company.types';

export class CompanyRepository {
  static async create(data: CompanyPayload) {
    return prisma.company.create({
      data,
    });
  }

  static async updateByUserId(userId: number, data: UpdateCompanyPayload) {
    return prisma.company.update({
      where: { userId },
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
