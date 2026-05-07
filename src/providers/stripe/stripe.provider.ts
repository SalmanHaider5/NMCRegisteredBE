import { app, stripe, stripeConfig } from '../../config';
import { Customer, CancelSubscriptionResult } from '../provider.types';
import {
  StripeCustomer,
  StripeSubscriptionDTO,
  StripePaymentPlan,
  StripeProduct,
} from './stripe.types';

export class StripeProvider {
  static async getPlans(): Promise<StripePaymentPlan[]> {
    const { data } = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });
    return data.map((price) => {
      const amount = price.unit_amount ? price.unit_amount / 100 : 0;
      return {
        stripePriceId: price.id,
        description: 'stripe',
        isActive: price.active,
        key: (price.product as StripeProduct).name.split(' ')[0].toLowerCase(),
        name: (price.product as StripeProduct).name,
        price: Number(amount),
        currency: price.currency,
        interval: price.recurring?.interval || 'week',
      };
    });
  }

  static async createCustomer(data: StripeCustomer): Promise<Customer> {
    const customer = await stripe.customers.create({
      email: data.email,
      name: data.name,
    });

    return {
      id: customer.id,
      email: customer.email ?? undefined,
    };
  }

  static async createSubscription(
    data: StripeSubscriptionDTO,
    companyId: number,
  ) {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: data.customerId,
      line_items: [
        {
          price: data.planId,
          quantity: 1,
        },
      ],
      success_url: `${app.clientUrl}/success?method=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${app.clientUrl}/cancel`,
      subscription_data: {
        metadata: {
          companyId,
          planId: data.planId,
        },
      },

      metadata: {
        companyId,
        planId: data.planId,
      },
    });

    return {
      sessionId: session.id,
      status: 'PENDING',
      planId: data.planId,
      currentPeriodEnd: undefined,
      hostedInvoiceUrl: null,
      clientSecret: null,
      url: session.url,
    };
  }

  static confirmPaymentWebhook(signature: string, payload: Buffer | string) {
    try {
      const secret = stripeConfig.webhookSecret;
      const event = stripe.webhooks.constructEvent(payload, signature, secret);

      if (
        typeof event === 'object' &&
        event !== null &&
        'type' in event &&
        typeof event.type === 'string' &&
        'data' in event &&
        typeof event.data === 'object' &&
        event.data !== null &&
        'object' in event.data
      ) {
        const eventType = event.type;
        const session = event.data.object as unknown;
        return {
          id: event.id,
          event: eventType,
          session,
        };
      }
      return { error: 'Invalid event object' };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { error: err.message };
      }
      return { error: 'Unknown webhook error' };
    }
  }

  static async cancelSubscription(
    id: string,
  ): Promise<CancelSubscriptionResult> {
    const subscription = await stripe.subscriptions.cancel(id);
    return {
      id: subscription.id,
      status: subscription.status,
    };
  }

  static async getPaymentMethods(customerId: string) {
    const methods = stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return methods;
  }

  static async removePaymentMethod(paymentMethod: string) {
    await stripe.paymentMethods.detach(paymentMethod);
  }
}
