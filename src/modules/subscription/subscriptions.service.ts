import { StripeProvider } from '../../providers/stripe/stripe.provider';
import { PaypalProvider } from '../../providers/paypal/paypal.provider';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { AppError } from '../../utils';
import { CompanyRepository } from '../company/company.repository';
import {
  User,
  ProviderSubscription,
  PaymentMethod,
  Subscription,
  CheckoutSession,
  SubscriptionResponse,
  PaypalWebHookEvent,
} from './subscription.types';
import { MESSAGES, STATUSES } from '../../constants';
import { SubscriptionRepository } from './subscription.repository';
import { PaymentRepository } from '../payment/payment.repository';
import { PAYMENT_METHODS } from './subscription.constants';
import { PlanRepository } from '../plan/plan.repository';
import { Company, Plan } from '@prisma/client';

export class SubscriptionService {
  private static getProvider(method: PaymentMethod) {
    switch (method) {
      case 'stripe':
        return new StripeProvider();
      case 'paypal':
        return new PaypalProvider();
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

  private static async getPlan(id: number) {
    const plan = await PlanRepository.getById(id);
    if (!plan) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    return plan;
  }

  private static async createCustomer(email: string, name?: string) {
    return StripeProvider.createCustomer({
      email,
      name,
    });
  }

  private static async createStripeSubscription(
    customerId: string,
    planId: string,
    companyId: number,
  ): Promise<ProviderSubscription> {
    const payload = {
      planId,
      customerId,
    };
    return StripeProvider.createSubscription(payload, companyId);
  }

  private static async createPaypalSubscription(
    planId: string,
    companyId: number,
  ): Promise<ProviderSubscription> {
    return PaypalProvider.createSubscription(planId, companyId);
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
    const plan = await PlanRepository.getByStripePriceId(planId);
    const paymentPayload = {
      companyId: subscription.companyId,
      subscriptionId: subscription.id,
      amount: plan?.price || 0,
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
    subscription: SubscriptionResponse,
  ) {
    return prisma.$transaction(async (tx) => {
      const result = await tx.subscription.create({
        data: {
          companyId,
          provider: method,
          plan: data.planId,
          status: STATUSES.PENDING,
          stripeSubscriptionId: method === PAYMENT_METHODS.STRIPE ? null : null,
          paypalSubscriptionId:
            method === PAYMENT_METHODS.STRIPE ? null : subscription.id,
          stripeSessionId:
            method === PAYMENT_METHODS.STRIPE ? subscription.sessionId : null,
          stripeCustomerId:
            method === PAYMENT_METHODS.STRIPE ? data.customerId : null,
          currentPeriodEnd: null,
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

  private static async createSubscription(
    method: PaymentMethod,
    plan: Plan,
    company: Company,
    user: User,
  ) {
    let subscription: SubscriptionResponse;
    const payload = {
      planId: (method === PAYMENT_METHODS.STRIPE
        ? plan.stripePriceId
        : plan.paypalPlanId) as string,
      amount: plan.price,
      currency: plan.currency,
      customerId: '',
    };
    const companyName = `${company.firstName} ${company.lastName}`;
    switch (method) {
      case PAYMENT_METHODS.STRIPE: {
        const customer = await this.createCustomer(user.email, companyName);
        subscription = await this.createStripeSubscription(
          customer.id as string,
          plan.stripePriceId as string,
          company.id as number,
        );
        payload.customerId = customer.id as string;
        break;
      }
      case PAYMENT_METHODS.PAYPAL: {
        subscription = await this.createPaypalSubscription(
          plan.paypalPlanId as string,
          company.id as number,
        );
        break;
      }
      default:
        throw new AppError(MESSAGES.INVALID_PAYMENT_METHOD, 400);
    }
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
    const plan = await this.getPlan(Number(data.planId));
    const companyName = `${company.firstName} ${company.lastName}`;
    const subscription = await SubscriptionRepository.findByCompanyId(
      company.id,
    );
    if (subscription) {
      if (subscription?.status === STATUSES.ACTIVE) {
        throw new AppError(MESSAGES.ACTIVE_SUBSCRIPTION);
      } else {
        const company = await this.getCompany(user.id);
        let response: SubscriptionResponse;
        switch (method) {
          case PAYMENT_METHODS.STRIPE: {
            let customerId: string;
            if (subscription.stripeCustomerId) {
              customerId = subscription.stripeCustomerId as string;
            } else {
              const customer = await this.createCustomer(
                user.email,
                companyName,
              );
              customerId = customer.id as string;
            }
            response = await this.createStripeSubscription(
              customerId,
              plan.stripePriceId as string,
              company.id as number,
            );
            break;
          }
          case PAYMENT_METHODS.PAYPAL: {
            response = await this.createPaypalSubscription(
              plan.paypalPlanId as string,
              company.id as number,
            );
            break;
          }
          default:
            throw new AppError(MESSAGES.INVALID_PAYMENT_METHOD, 400);
        }
        const result = await SubscriptionRepository.findByCompanyId(company.id);
        if (result) {
          const subscriptionId = result.id as number;
          await SubscriptionRepository.updateSubscriptionById(
            subscriptionId,
            response,
          );

          const paymentPayload = {
            companyId: company.id,
            provider: method,
            status: STATUSES.PENDING,
            transactionId:
              (method === PAYMENT_METHODS.STRIPE
                ? response.sessionId
                : response.id) ?? undefined,
            amount: plan.price ?? 0,
            currency: plan.currency ?? 'gbp',
            subscriptionId,
          };
          await PaymentRepository.create(paymentPayload);
        }
      }
    } else {
      const subscription = await this.createSubscription(
        method,
        plan,
        company,
        user,
      );
      return subscription;
    }
  }

  static async confirmStripePayment(
    signature: string,
    payload: Buffer | string,
  ) {
    const response = StripeProvider.confirmPaymentWebhook(signature, payload);
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

  static async confirmPaypalPayment(event: PaypalWebHookEvent) {
    const eventType = event.event_type;
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const subscriptionId = event.resource?.id as string;
        await SubscriptionRepository.updateSubscriptionByPaypalId(
          subscriptionId,
          {
            status: STATUSES.ACTIVE,
          },
        );
        break;
      }
      case 'PAYMENT.SALE.COMPLETED': {
        const subscriptionId = event.resource?.id as string;
        await SubscriptionRepository.updateSubscriptionByPaypalId(
          subscriptionId,
          {
            status: STATUSES.ACTIVE,
            currentPeriodStart: new Date(),
          },
        );
        break;
      }
      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        const subscriptionId = event.resource?.id as string;
        await SubscriptionRepository.updateSubscriptionByPaypalId(
          subscriptionId,
          {
            status: STATUSES.CANCELLED,
          },
        );
        break;
      }
      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        const subscriptionId = event.resource?.id as string;
        await SubscriptionRepository.updateSubscriptionByPaypalId(
          subscriptionId,
          {
            status: STATUSES.SUSPENDED,
          },
        );
        break;
      }
      default:
        console.error('Unexpected event', eventType);
        return event;
    }
  }

  static async cancelSubscription(
    method: PaymentMethod,
    userId: number,
    reason?: string,
  ) {
    const company = await this.getCompany(userId);
    const subscription = await SubscriptionRepository.findByCompanyId(
      company.id,
    );
    const subscriptionStatus = subscription?.status as string;
    const id = subscription?.id as number;
    const subscriptionId = subscription?.stripeSubscriptionId as string;
    if (subscriptionStatus === STATUSES.ACTIVE) {
      if (PAYMENT_METHODS.STRIPE === method) {
        await StripeProvider.cancelSubscription(subscriptionId);
      } else {
        await PaypalProvider.cancelSubscription(subscriptionId, reason || '');
      }
      const payload = {
        status: STATUSES.CANCELLED,
      };
      await SubscriptionRepository.updateSubscriptionById(id, payload);
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
    const methods = await StripeProvider.getPaymentMethods(customerId);
    return methods;
  }

  static async removePaymentMethod(
    method: PaymentMethod,
    paymentMethod: string,
  ) {
    await StripeProvider.removePaymentMethod(paymentMethod);
    return {
      message: MESSAGES.PAYMENT_METHOD_REMOVED,
    };
  }
}
