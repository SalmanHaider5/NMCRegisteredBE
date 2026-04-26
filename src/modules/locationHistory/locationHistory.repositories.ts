import { prisma } from '../../lib/prisma';

export class LocationHistoryRepository {
  static findByUserId(userId: number) {
    return prisma.locationHistory.findFirst({ where: { userId } });
  }
}