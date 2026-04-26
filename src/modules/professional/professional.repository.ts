import { prisma } from '../../lib/prisma';

export class ProfessionalRepository {
  static findByUserId(userId: number) {
    return prisma.professional.findFirst({ where: { userId } });
  }
}