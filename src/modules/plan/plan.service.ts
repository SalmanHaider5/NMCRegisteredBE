import { PlanRepository } from './plan.repository';
import { MESSAGES } from '../../constants';
import { StripeProvider } from '../../providers/stripe/stripe.provider';
import { PaypalProvider } from '../../providers/paypal/paypal.provider';
import { mapPlans } from './plan.mapper';

export const PlanService = {
  getAllPlans: async () => {
    const shifts = await PlanRepository.get();
    return {
      message: MESSAGES.PLANS_LIST,
      data: shifts,
    };
  },

  syncPlans: async () => {
    const stripePlans = await StripeProvider.getPlans();
    const paypalPlans = await PaypalProvider.getPlans();
    const plans = mapPlans(stripePlans, paypalPlans);
    await PlanRepository.sync(plans);
    return {
      message: MESSAGES.PLANS_LIST,
      data: plans,
    };
  },
};
