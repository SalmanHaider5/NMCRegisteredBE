export type PaymentMethod = 'stripe' | 'paypal';

export type User = {
  id: number;
  email: string;
};

export type ProviderSubscription = {
  status?: string;
  currentPeriodEnd?: Date;
  sessionId?: string | null;
  clientSecret?: string | null;
  hostedInvoiceUrl?: string | null;
  url?: string | null;
};

export type SubscriptionResponse = {
  id?: string;
  status?: string;
  currentPeriodEnd?: Date;
  sessionId?: string | null;
  clientSecret?: string | null;
  hostedInvoiceUrl?: string | null;
  url?: string | null;
};

export type Subscription = {
  name?: string;
  customerId: string;
  planId: string;
  amount?: number;
  currency?: string;
};

type Session = {
  id: string;
  subscription: string;
};

export type CheckoutResponse = {
  session: Session;
  event: string;
};

export type CheckoutSession = {
  id: string;
  subscription: string;
  current_period_start?: number;
  current_period_end?: number;
  lines?: {
    data: {
      period?: {
        start: number;
        end: number;
      };
    }[];
  };
};

export type PaypalWebHookEvent = {
  event_type: string;
  resource: {
    id: string;
  };
};
