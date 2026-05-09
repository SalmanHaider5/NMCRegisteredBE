import { prisma } from '../../lib/prisma';

export class PaymentRepository {
  static create(data: {
    companyId: number;
    subscriptionId: number;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    transactionId?: string;
  }) {
    return prisma.payment.create({
      data,
    });
  }

  static updateByTrxId(trxId: string, status: string) {
    return prisma.payment.update({
      where: { transactionId: trxId },
      data: {
        status,
        paidAt: new Date(),
      },
    });
  }
}
