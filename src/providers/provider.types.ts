export type PaymentPlan = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval?: string;
};

export type CreateCustomerDTO = {
  email: string;
  name?: string;
};

export type CreateSubscriptionDTO = {
  email: string;
  name?: string;
  customerId: string;
  planId: string;
  amount?: number;
  currency?: string;
};

export type Customer = {
  id: string;
  email?: string;
};

export type Subscription = {
  id: string;
  status: string;
  planId: string;
  currentPeriodEnd?: number;
};

export type CancelSubscriptionResult = {
  id: string;
  status: string;
};
