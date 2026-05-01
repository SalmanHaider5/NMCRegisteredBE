export type PaymentMethod = 'stripe' | 'paypal';

export type User = {
  id: number;
  email: string;
};

export type StripeSubscription = {
  id: string;
  status: string;
  currentPeriodEnd?: number;
  sessionId?: string | null;
  clientSecret?: string | null;
  hostedInvoiceUrl?: string | null;
  url?: string | null;
};

export type Subscription = {
  email: string;
  name?: string;
  customerId: string;
  savePaymentMethod: boolean;
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
