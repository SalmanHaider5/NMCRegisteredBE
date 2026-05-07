import { Plans } from './plan.types';

export const mapPlans = (stripePlans: Plans, paypalPlans: Plans) => {
  const stripeMap = new Map(stripePlans.map((p) => [p.interval, p]));
  const paypalMap = new Map(paypalPlans.map((p) => [p.interval, p]));

  return [...stripeMap.keys()]
    .filter((interval) => paypalMap.has(interval))
    .map((interval) => {
      const stripe = stripeMap.get(interval);
      const paypal = paypalMap.get(interval);

      return {
        key: stripe?.key ?? paypal?.key ?? '',
        name: stripe?.name ?? paypal?.name ?? '',
        description: '',
        price: Number(stripe?.price ?? paypal?.price),
        currency: stripe?.currency ?? paypal?.currency ?? 'GBP',
        isActive: stripe?.isActive ?? paypal?.isActive ?? false,
        interval,
        stripePriceId: stripe?.stripePriceId ?? '',
        paypalPlanId: paypal?.paypalPlanId ?? '',
      };
    });
};
