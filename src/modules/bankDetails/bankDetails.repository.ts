import { prisma } from '../../lib/prisma';
import {
  BankDetailsPayload,
  UpdateBankDetailsPayload,
} from './bankDetails.types';

export class BankDetailsRepository {
  static async create(data: BankDetailsPayload) {
    return prisma.bankDetails.create({
      data,
    });
  }

  static async updateByUserId(userId: number, data: UpdateBankDetailsPayload) {
    return prisma.bankDetails.update({
      where: { userId },
      data,
    });
  }

  static async findByUserId(userId: number) {
    return prisma.bankDetails.findUnique({
      where: {
        userId,
      },
    });
  }
}
