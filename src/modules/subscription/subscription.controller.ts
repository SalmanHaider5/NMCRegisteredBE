import { Request, Response } from 'express';
import { SubscriptionService } from './subscriptions.service';
import { asyncHandler, ApiResponseUtil } from '../../utils';

export class SubscriptionController {
  static getPlans = asyncHandler(async (req: Request, res: Response) => {
    const method = req.query.method as 'stripe' | 'paypal';
    const plans = await SubscriptionService.getPlans(method);
    res.json({ success: true, data: plans });
  });

  static getPlan = asyncHandler(async (req: Request, res: Response) => {
    const method = req.query.method as 'stripe' | 'paypal';
    const priceId = req.params.priceId as string;
    const plan = await SubscriptionService.getPricePlan(method, priceId);
    res.json({ success: true, data: plan });
  });

  static initPayment = asyncHandler(async (req: Request, res: Response) => {
    const method = req.query.method as 'stripe' | 'paypal';
    const payload = req.body;
    const user = {
      id: req.user?.id as number,
      email: req.user?.email as string,
    };
    const subscription = await SubscriptionService.initPayment(
      method,
      payload,
      user,
    );
    res.json({ success: true, data: subscription });
  });

  static confirmPayment = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const payload = req.body;
    const method = 'stripe';
    await SubscriptionService.confirmPayment(method, signature, payload);
    res.status(200).json({ received: true });
  });

  static cancelSubscription = asyncHandler(
    async (req: Request, res: Response) => {
      const method = req.query.method as 'stripe' | 'paypal';
      const userId = req.user?.id as number;
      const result = await SubscriptionService.cancelSubscription(
        method,
        userId,
      );
      return res
        .status(200)
        .json(ApiResponseUtil.success(result.message, result.data));
    },
  );

  static getPaymentMethods = asyncHandler(
    async (req: Request, res: Response) => {
      const method = req.query.method as 'stripe' | 'paypal';
      const userId = req.user?.id as number;
      const result = await SubscriptionService.getPaymentMethods(
        method,
        userId,
      );
      return res.status(200).json(ApiResponseUtil.success('', result));
    },
  );

  static removePaymentMethod = asyncHandler(
    async (req: Request, res: Response) => {
      const method = req.query.method as 'stripe' | 'paypal';
      const paymentMethod = req.body.paymentMethod as string;
      const result = await SubscriptionService.removePaymentMethod(
        method,
        paymentMethod,
      );
      return res.status(200).json(ApiResponseUtil.success(result.message, {}));
    },
  );
}
