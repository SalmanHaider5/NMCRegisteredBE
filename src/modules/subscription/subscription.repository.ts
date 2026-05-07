import { prisma } from '../../lib/prisma';
import { ProviderSubscription } from './subscription.types';

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

  static async updateSubscriptionById(id: number, data: ProviderSubscription) {
    return prisma.subscription.updateMany({
      where: { id },
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

  static async updateSubscriptionByPaypalId(
    subscriptionId: string,
    data: {
      status?: string;
      currentPeriodStart?: Date;
    },
  ) {
    return prisma.subscription.update({
      where: { paypalSubscriptionId: subscriptionId },
      data,
    });
  }
}
