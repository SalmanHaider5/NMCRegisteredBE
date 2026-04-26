import { prisma } from '../../lib/prisma';

export class TokenRepository {

  static async create(data: {
    userId: number;
    token: string;
    expiresAt?: Date;
  }) {
    return prisma.token.create({ data });
  }

  static async upsert(data: {
    userId: number;
    token: string;
    expiresAt?: Date;
  }) {
    return prisma.token.upsert({
      where: {
        userId: data.userId,
      },
      update: {
        token: data.token,
        expiresAt: data.expiresAt
      },
      create: data
    });
  }

  static findByUserId(userId: number) {
    return prisma.token.findUnique({
      where: { userId }
    });
  }

  static deleteByUserId(userId: number) {
    return prisma.token.delete({
      where: { userId }
    });
  }
  
}