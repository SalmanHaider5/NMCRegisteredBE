declare module '@paypal/checkout-server-sdk' {
  export namespace core {
    class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    class PayPalHttpClient {
      constructor(environment: SandboxEnvironment | LiveEnvironment);
      execute<T = unknown, R = unknown>(request: T): Promise<R>;
    }
  }

  export namespace subscriptions {
    interface SubscriptionRequestBody {
      plan_id: string;
      application_context?: {
        brand_name?: string;
        user_action?: string;
        return_url?: string;
        cancel_url?: string;
      };
    }

    interface SubscriptionCancelBody {
      reason?: string;
    }

    class SubscriptionCreateRequest {
      requestBody(body: SubscriptionRequestBody): void;
    }

    class SubscriptionGetRequest {
      constructor(id: string);
    }

    class SubscriptionCancelRequest {
      constructor(id: string);
      requestBody(body: SubscriptionCancelBody): void;
    }
  }
}
