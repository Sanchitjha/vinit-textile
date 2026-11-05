import { ServiceUnavailableError } from '../../../shared/errors';
import {
  CreatePaymentResult,
  IPaymentService,
  RefundResult,
  WebhookEvent,
} from './payment-provider.interface';

/**
 * Used while Razorpay credentials are not configured (Cash on Delivery only), unless ALLOW_STUB_PAYMENTS=true.
 * Every call fails, so nothing — not /payments/verify, not an unsigned webhook — can mark an order as paid.
 */
export class DisabledPaymentService implements IPaymentService {
  private fail(): never {
    throw new ServiceUnavailableError('Online payment is not available yet. Please use Cash on Delivery.', 'ONLINE_PAYMENT_UNAVAILABLE');
  }

  async createPayment(): Promise<CreatePaymentResult> {
    return this.fail();
  }

  async verifyPayment(): Promise<boolean> {
    return this.fail();
  }

  async handleWebhook(): Promise<WebhookEvent> {
    return this.fail();
  }

  async refundPayment(): Promise<RefundResult> {
    return this.fail();
  }
}
