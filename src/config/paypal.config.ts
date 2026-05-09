import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

const environment =
  process.env.PAYPAL_MODE === 'live'
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);

export const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(
  environment,
);

export const paypalConfig = {
  mode: process.env.PAYPAL_MODE || 'sandbox',
  clientId,
  clientSecret,
  webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
  productId: process.env.PAYPAL_PRODUCT_ID || '',
  baseUrl:
    process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com',
};
