export type StripeCustomer = {
  email: string;
  name?: string;
};

export type StripeSubscriptionDTO = {
  customerId: string;
  planId: string;
};

export type StripeSubscription = {
  id: string;
  status: string;
  planId: string;
  currentPeriodEnd?: number;
  hostedInvoiceUrl?: string | null;
  clientSecret?: string | null;
};

type PaymentIntent = {
  client_secret: string;
};

type LatestInvoice = {
  hosted_invoice_url?: string | null;
  payment_intent?: string | PaymentIntent | null;
};

export type StripeSubscriptionResponse = {
  id: string;
  status: string;
  items: {
    data: {
      plan: {
        id: string;
      };
    }[];
  };
  current_period_end?: number;
  latest_invoice?: string | LatestInvoice | null;
};

export type StripePaymentPlan = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval?: string;
};

export type StripeSubscriptionEvent =
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed';

export type StripeInvoiceObject = {
  id: string;
  subscription?: string;
  customer?: string;
  status?: string;
  current_period_end?: number;
  [key: string]: unknown;
};

export type WebhookResult =
  | {
      event: string;
      subscription?: string;
    }
  | { error: string };

export type StripeProduct = {
  id: string;
  name: string;
};
