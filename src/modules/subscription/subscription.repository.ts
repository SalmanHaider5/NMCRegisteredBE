import { prisma } from '../../lib/prisma';

export class SubscriptionRepository {
  static create(data: {
    companyId: number;
    provider: string;
    planId: string;
    status: string;
    stripeSubscriptionId?: string | null;
    paypalSubscriptionId?: string | null;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date | null;
  }) {
    return prisma.subscription.create({
      data,
    });
  }

  static async findByCompanyId(companyId: number) {
    return prisma.subscription.findUnique({
      where: { companyId },
    });
  }

  static async updateStatusBySessionId(
    sessionId: string,
    subscriptionId: string,
    status: string,
  ) {
    return prisma.subscription.update({
      where: { stripeSessionId: sessionId },
      data: {
        status,
        stripeSubscriptionId: subscriptionId,
      },
    });
  }

  static async updateSubscription(
    subscriptionId: string,
    data: {
      status?: string;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
    },
  ) {
    return prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data,
    });
  }
}
