import { prisma } from '../../lib/prisma';

export class PhoneRepository {
  static findByUserId(userId: number) {
    return prisma.phone.findUnique({
      where: { userId },
    });
  }

  static findVerifiedPhone(phone: string) {
    return prisma.phone.findFirst({
      where: {
        phone,
        status: true,
      },
    });
  }

  static create(data: {
    userId: number;
    phone: string;
    code: string;
    status: boolean;
  }) {
    return prisma.phone.create({
      data,
    });
  }

  static updateById(
    id: number,
    data: {
      phone?: string;
      code?: string;
      status?: boolean;
    },
  ) {
    return prisma.phone.update({
      where: { id },
      data,
    });
  }

  static updateByUserId(
    userId: number,
    data: {
      phone?: string;
      code?: string;
      status?: boolean;
    },
  ) {
    return prisma.phone.update({
      where: { userId },
      data,
    });
  }
}
