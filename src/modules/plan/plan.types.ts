export type Plan = {
  key: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  isActive: boolean;
  stripePriceId?: string;
  paypalPlanId?: string;
};

export type Plans = Plan[];
