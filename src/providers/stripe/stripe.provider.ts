import { app, stripe, stripeConfig } from '../../config';
import { PaymentProvider } from '../provider.interface';
import { Customer, CancelSubscriptionResult } from '../provider.types';
import {
  StripeCustomer,
  StripeSubscriptionDTO,
  StripeSubscriptionResponse,
  StripeSubscription,
  StripePaymentPlan,
  StripeProduct,
} from './stripe.types';

export class StripeProvider implements PaymentProvider {
  async getPlans(): Promise<StripePaymentPlan[]> {
    const { data } = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });
    return data.map((price) => {
      const amount = price.unit_amount ? price.unit_amount / 100 : 0;
      return {
        id: price.id,
        name: (price.product as StripeProduct).name,
        amount,
        currency: price.currency,
        interval: price.recurring?.interval,
      };
    });
  }

  async getPlan(priceId: string): Promise<StripePaymentPlan | null> {
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });
    if (!price.active) return null;
    const amount = price.unit_amount ? price.unit_amount / 100 : 0;
    return {
      id: price.id,
      name: (price.product as StripeProduct).name,
      amount,
      currency: price.currency,
      interval: price.recurring?.interval,
    };
  }

  async createCustomer(data: StripeCustomer): Promise<Customer> {
    const customer = await stripe.customers.create({
      email: data.email,
      name: data.name,
    });

    return {
      id: customer.id,
      email: customer.email ?? undefined,
    };
  }

  async createSubscription(data: StripeSubscriptionDTO, companyId: number) {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: data.customerId,
      line_items: [
        {
          price: data.planId,
          quantity: 1,
        },
      ],
      success_url: `${app.clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
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
      id: '',
      sessionId: session.id,
      status: 'PENDING',
      planId: data.planId,
      currentPeriodEnd: undefined,
      hostedInvoiceUrl: null,
      clientSecret: null,
      url: session.url,
    };
  }

  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<StripeSubscription> {
    const subscription: StripeSubscriptionResponse =
      await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice.payment_intent'],
      });

    const invoice =
      subscription.latest_invoice &&
      typeof subscription.latest_invoice !== 'string'
        ? subscription.latest_invoice
        : null;

    const paymentIntent =
      invoice?.payment_intent && typeof invoice.payment_intent !== 'string'
        ? invoice.payment_intent
        : null;

    const plan = subscription?.items.data[0]?.plan ?? null;

    return {
      id: subscription.id,
      status: subscription.status,
      planId: plan?.id || '',
      currentPeriodEnd: subscription.current_period_end
        ? subscription.current_period_end
        : undefined,
      hostedInvoiceUrl: invoice?.hosted_invoice_url,
      clientSecret: paymentIntent?.client_secret,
    };
  }

  confirmPaymentWebhook(signature: string, payload: Buffer | string) {
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

  async cancelSubscription(id: string): Promise<CancelSubscriptionResult> {
    const subscription = await stripe.subscriptions.cancel(id);
    return {
      id: subscription.id,
      status: subscription.status,
    };
  }

  async getPaymentMethods(customerId: string) {
    const methods = stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    return methods;
  }

  async removePaymentMethod(paymentMethod: string) {
    await stripe.paymentMethods.detach(paymentMethod);
  }
}
