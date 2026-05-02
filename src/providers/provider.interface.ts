import {
  PaymentPlan,
  CreateCustomerDTO,
  CreateSubscriptionDTO,
  Customer,
  Subscription,
  CancelSubscriptionResult,
} from './provider.types';

export interface PaymentProvider {
  getPlans(): Promise<PaymentPlan[]>;
  createCustomer(data: CreateCustomerDTO): Promise<Customer>;
  createSubscription(
    data: CreateSubscriptionDTO,
    companyId: number,
  ): Promise<Subscription>;
  cancelSubscription(id: string): Promise<CancelSubscriptionResult>;
}

export interface SmsProvider {
  send(phone: string, message: string): Promise<void>;
}
