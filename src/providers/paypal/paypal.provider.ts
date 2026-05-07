import axios from 'axios';
import { redis } from '../../lib/redis';
import { paypalConfig, app } from '../../config';

export class PaypalProvider {
  private static async getAccessToken() {
    const cachedToken = await redis.get('paypal_access_token');
    if (cachedToken) return cachedToken;
    const auth = Buffer.from(
      `${paypalConfig.clientId}:${paypalConfig.clientSecret}`,
    ).toString('base64');
    const response = await axios.post(
      `${paypalConfig.baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const { access_token, expires_in } = response.data;
    const ttl = expires_in - 60 || 3600;
    await redis.set('paypal_access_token', access_token, {
      EX: ttl,
    });
    return access_token;
  }

  static async getPlans() {
    const token = await this.getAccessToken();
    const plansUrl = `${paypalConfig.baseUrl}/v1/billing/plans?product_id=${paypalConfig.productId}`;
    const { data } = await axios.get(plansUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const plans = data?.plans || [];
    const detailedPlans = await Promise.all(
      plans.map(async (plan: { id: string }) => {
        const url = `${paypalConfig.baseUrl}/v1/billing/plans/${plan.id}`;
        const { data: planDetails } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return {
          paypalPlanId: planDetails?.id,
          description: 'paypal',
          isActive: planDetails?.status === 'ACTIVE',
          key: planDetails?.name.split(' ')[0].toLowerCase(),
          name: planDetails?.name,
          price: Number(
            planDetails?.billing_cycles[0]?.pricing_scheme?.fixed_price?.value,
          ),
          currency:
            planDetails?.billing_cycles[0]?.pricing_scheme?.fixed_price
              ?.currency_code,
          interval:
            planDetails?.billing_cycles[0]?.frequency?.interval_unit.toLowerCase(),
        };
      }),
    );
    return detailedPlans;
  }

  static async createSubscription(planId: string, companyId: number) {
    const token = await this.getAccessToken();
    const url = `${paypalConfig.baseUrl}/v1/billing/subscriptions`;
    const response = await axios.post(
      url,
      {
        plan_id: planId,
        custom_id: String(companyId),
        applicationContext: {
          brand_name: 'NMC Registered',
          success_url: `${app.clientUrl}/success?method=paypal`,
          cancel_url: `${app.clientUrl}/cancel`,
          user_action: 'SUBSCRIBE_NOW',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const subscription = response.data;
    const approvalUrl = subscription.links.find(
      (l: { rel: string }) => l.rel === 'approve',
    )?.href;

    return {
      id: subscription.id,
      status: subscription.status,
      planId: planId,
      companyId: companyId,
      url: approvalUrl,
    };
  }
  static async cancelSubscription(subscriptionId: string, reason: string) {
    const token = await this.getAccessToken();
    const url = `${paypalConfig.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`;
    await axios.post(
      url,
      {
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
