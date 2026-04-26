import { prisma } from '../../lib/prisma';

export class PhoneRepository {

  static findByUserId(userId: number) {
    return prisma.phone.findFirst({ where: { userId } });
  }

  static updateCode(userId: number, code: string) {
    return prisma.phone.update({
      where: { userId },
      data: { code }
    });
  }
}