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

  static findByIdForOffer(id: number) {
    return prisma.professional.findFirst({
      where: { id },
      select: { userId: true, nmcPin: true, fullName: true },
    });
  }

  static findByQualification(
    page: number,
    limit: number,
    qualification?: string,
  ) {
    const pageNumber = Math.max(page, 1);
    const pageSize = Math.max(limit, 1);
    const query = qualification?.trim();
    return prisma.professional.findMany({
      where: {
        ...(query
          ? {
              qualification: {
                contains: query,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        fullName: true,
        address: true,
        city: true,
        nmcPin: true,
        hasTransport: true,
        qualification: true,
        cpdHours: true,
        experience: true,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
  }
}
