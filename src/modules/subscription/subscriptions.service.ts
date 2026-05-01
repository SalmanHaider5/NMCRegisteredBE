import { StripeProvider } from '../../providers/stripe/stripe.provider';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { AppError } from '../../utils';
import { CompanyRepository } from '../company/company.repository';
import {
  User,
  StripeSubscription,
  PaymentMethod,
  Subscription,
  CheckoutSession,
} from './subscription.types';
import { MESSAGES, STATUSES } from '../../constants';
import { SubscriptionRepository } from './subscription.repository';
import { PaymentRepository } from '../payment/payment.repository';

export class SubscriptionService {
  private static getProvider(method: PaymentMethod) {
    switch (method) {
      case 'stripe':
        return new StripeProvider();
      case 'paypal':
        return new StripeProvider();
      default:
        throw new Error('Invalid payment method');
    }
  }

  private static async getCompany(userId: number) {
    const company = await CompanyRepository.findByUserId(userId);
    if (!company) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, 404);
    }
    return company;
  }

  private static async createCustomer(
    method: PaymentMethod,
    email: string,
    name?: string,
  ) {
    const provider = this.getProvider(method);
    return provider.createCustomer({
      email,
      name,
    });
  }

  private static async getSubscription(
    method: PaymentMethod,
    subscriptionId: string,
  ) {
    const provider = this.getProvider(method);
    const subescripton = await provider.retrieveSubscription(subscriptionId);
    return subescripton;
  }

  static async getPricePlan(method: PaymentMethod, priceId: string) {
    const provider = this.getProvider(method);
    const plan = await provider.getPlan(priceId);
    if (!plan) {
      throw new AppError(MESSAGES.PLAN_NOT_FOUND, 404);
    }
    return plan;
  }

  private static async createProviderSubscription(
    method: PaymentMethod,
    customerId: string,
    planId: string,
    companyId: number,
  ): Promise<StripeSubscription> {
    const provider = this.getProvider(method);
    const payload = {
      planId,
      customerId,
    };
    return provider.createSubscription(payload, companyId);
  }

  private static async updateSubscriptionStatus(
    subscriptionId: string,
    data: {
      status: string;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
    },
  ) {
    const subscription = await SubscriptionRepository.updateSubscription(
      subscriptionId,
      data,
    );
    const planId = subscription.plan as string;
    const plan = await this.getProvider('stripe').getPlan(planId);
    const paymentPayload = {
      companyId: subscription.companyId,
      subscriptionId: subscription.id,
      amount: plan?.amount || 0,
      currency: plan?.currency || 'gbp',
      status: data.status,
      provider: 'stripe',
    };
    await PaymentRepository.create(paymentPayload);
    return subscription;
  }

  private static async updateSubscriptionPeriod(
    subscriptionId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const payload = {
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate,
    };
    return await SubscriptionRepository.updateSubscription(
      subscriptionId,
      payload,
    );
  }

  private static async updateFirstSubscriptionStatus(
    sessionId: string,
    subscriptionId: string,
    status: string,
  ) {
    await PaymentRepository.updateByTrxId(sessionId, status);
    return await SubscriptionRepository.updateStatusBySessionId(
      sessionId,
      subscriptionId,
      status,
    );
  }

  private static async saveSubscriptionAndPayment(
    companyId: number,
    method: PaymentMethod,
    data: Subscription,
    subscription: StripeSubscription,
  ) {
    return prisma.$transaction(async (tx) => {
      const result = await tx.subscription.create({
        data: {
          companyId,
          provider: method,
          plan: data.planId,
          status: STATUSES.PENDING,
          stripeSubscriptionId: method === 'stripe' ? subscription.id : null,
          stripeSessionId: method === 'stripe' ? subscription.sessionId : null,
          stripeCustomerId: method === 'stripe' ? data.customerId : null,
          currentPeriodEnd: subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd * 1000)
            : null,
        },
      });

      await tx.payment.create({
        data: {
          companyId,
          provider: method,
          status: STATUSES.PENDING,
          transactionId: subscription.sessionId,
          amount: data.amount ?? 0,
          currency: data.currency ?? 'gbp',
          subscriptionId: result.id,
        },
      });

      return {
        subscription: result,
        clientSecret: subscription.clientSecret,
      };
    });
  }

  static async getPlans(method: PaymentMethod) {
    return this.getProvider(method).getPlans();
  }

  private static async updateSubscription(
    method: PaymentMethod,
    data: Subscription,
    customerId: string,
    companyId: number,
  ) {
    const planId = data.planId;
    const pricePlan = await this.getPricePlan(method, data.planId);
    const subscription = await this.createProviderSubscription(
      method,
      customerId,
      planId,
      companyId,
    );
    return prisma.$transaction(async (tx) => {
      const result = await tx.subscription.update({
        where: { companyId },
        data: {
          planId,
          status: STATUSES.PENDING,
          stripeSubscriptionId: '',
          currentPeriodStart: null,
          currentPeriodEnd: null,
          stripeSessionId: subscription.sessionId,
        },
      });

      await tx.payment.create({
        data: {
          companyId,
          provider: method,
          status: STATUSES.PENDING,
          transactionId: subscription.sessionId,
          amount: pricePlan.amount ?? 0,
          currency: pricePlan.currency ?? 'gbp',
          subscriptionId: result.id,
        },
      });

      return {
        subscription: result,
        clientSecret: subscription.clientSecret,
      };
    });
  }

  private static async createSubscription(
    method: PaymentMethod,
    data: Subscription,
    user: User,
  ) {
    const company = await this.getCompany(user.id);
    const customer = await this.createCustomer(method, user.email, data.name);
    const pricePlan = await this.getPricePlan(method, data.planId);
    const subscription = await this.createProviderSubscription(
      method,
      customer.id,
      data.planId,
      company.id,
    );
    const payload = {
      ...data,
      amount: pricePlan.amount,
      currency: pricePlan.currency,
      customerId: customer.id,
    };
    const result = await this.saveSubscriptionAndPayment(
      company.id,
      method,
      payload,
      subscription,
    );

    return {
      subscription: result,
      clientSecret: subscription.clientSecret || null,
      hostedInvoiceUrl: subscription.hostedInvoiceUrl || null,
      url: subscription.url || null,
    };
  }

  static async initPayment(
    method: PaymentMethod,
    data: Subscription,
    user: User,
  ) {
    const company = await this.getCompany(user.id);
    const subscription = await SubscriptionRepository.findByCompanyId(
      company.id,
    );
    if (subscription) {
      if (subscription?.status === STATUSES.ACTIVE) {
        throw new AppError(MESSAGES.ACTIVE_SUBSCRIPTION);
      } else {
        const customerId = subscription.stripeCustomerId as string;
        const companyId = company.id;
        return await this.updateSubscription(
          method,
          data,
          customerId,
          companyId,
        );
      }
    } else {
      const subscription = await this.createSubscription(method, data, user);
      return subscription;
    }
  }

  static async confirmPayment(
    method: PaymentMethod,
    signature: string,
    payload: Buffer | string,
  ) {
    const provider = this.getProvider(method);
    const response = provider.confirmPaymentWebhook(signature, payload);
    const session = response.session as CheckoutSession;
    const subscriptionId = session.subscription as string;
    const eventId = response.id;
    const redisKey = `stripe:event:${eventId}`;
    const alreadyProcessed = await redis.get(redisKey);

    if (alreadyProcessed) {
      console.log('Duplicate Stripe event ignored:', eventId);
      return;
    }

    switch (response.event) {
      case 'checkout.session.completed': {
        const sessionId = session.id as string;
        await this.updateFirstSubscriptionStatus(
          sessionId,
          subscriptionId,
          STATUSES.ACTIVE,
        );
        break;
      }
      case 'invoice.payment_succeeded': {
        const period = session.lines?.data?.[0]?.period;
        const startDate = period ? new Date(period.start * 1000) : null;
        const endDate = period ? new Date(period.end * 1000) : null;
        const data = {
          startDate,
          endDate,
          status: STATUSES.ACTIVE,
        };
        await this.updateSubscriptionStatus(subscriptionId, data);
        break;
      }
      case 'invoice.payment_failed': {
        const data = {
          status: STATUSES.PAST_DUE,
        };
        await this.updateSubscriptionStatus(subscriptionId, data);
        break;
      }
      case 'customer.subscription.deleted': {
        const data = {
          status: STATUSES.CANCELLED,
        };
        await this.updateSubscriptionStatus(subscriptionId, data);
        break;
      }
      case 'customer.subscription.created': {
        const subId = session.id;
        const startDateTimestamp = session.current_period_start || 0;
        const endDateTimestamp = session.current_period_end || 0;
        const startDate = new Date(startDateTimestamp * 1000);
        const endDate = new Date(endDateTimestamp * 1000);
        await this.updateSubscriptionPeriod(subId, startDate, endDate);
        break;
      }
      default: {
        console.error('Unexpected event', response.event);
        return response.session;
      }
    }
  }

  static async cancelSubscription(method: PaymentMethod, userId: number) {
    const company = await this.getCompany(userId);
    const subscription = await SubscriptionRepository.findByCompanyId(
      company.id,
    );
    const subscriptionStatus = subscription?.status as string;
    const subscriptionId = subscription?.stripeSubscriptionId as string;
    if (subscriptionStatus === STATUSES.ACTIVE) {
      const subscription =
        await this.getProvider(method).cancelSubscription(subscriptionId);
      const payload = {
        status: STATUSES.CANCELLED,
      };
      await this.updateSubscriptionStatus(subscription.id, payload);
      return {
        message: MESSAGES.CANCEL_SUCCESS,
        data: {},
      };
    } else {
      throw new AppError(MESSAGES.NO_ACTIVE_SUBSCRIPTION, 403);
    }
  }

  static async getPaymentMethods(method: PaymentMethod, userId: number) {
    const company = await this.getCompany(userId);
    const subscription = await SubscriptionRepository.findByCompanyId(
      company.id,
    );
    const customerId = subscription?.stripeCustomerId as string;
    const methods =
      await this.getProvider(method).getPaymentMethods(customerId);
    return methods;
  }

  static async removePaymentMethod(
    method: PaymentMethod,
    paymentMethod: string,
  ) {
    await this.getProvider(method).removePaymentMethod(paymentMethod);
    return {
      message: MESSAGES.PAYMENT_METHOD_REMOVED,
    };
  }
}
