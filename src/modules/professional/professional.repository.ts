import { Professional } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { CreateProfessionalDTO } from './professional.types';

export class ProfessionalRepository {
  static create(data: CreateProfessionalDTO) {
    return prisma.professional.create({
      data,
    });
  }

  static update(userId: number, data: Partial<Professional>) {
    return prisma.professional.update({
      where: { userId },
      data,
    });
  }

  static findByUserId(userId: number) {
    return prisma.professional.findFirst({ where: { userId } });
  }
}
