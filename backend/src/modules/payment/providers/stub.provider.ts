import crypto from 'crypto';
import { logger } from '../../../shared/utils/logger.util';
import {
  CreatePaymentInput,
  CreatePaymentResult,
  IPaymentService,
  RefundInput,
  RefundResult,
  VerifyPaymentInput,
  WebhookEvent,
} from './payment-provider.interface';

/**
 * Used when Razorpay credentials are not configured (local/dev). Mimics
 * gateway responses so the order → payment flow can be exercised end-to-end
 * without real credentials. Never selected when RAZORPAY_KEY_ID/SECRET are set.
 */
export class StubPaymentService implements IPaymentService {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    logger.warn('Using StubPaymentService — Razorpay is not configured', { orderId: input.orderId });
    return {
      providerOrderId: `stub_order_${crypto.randomUUID()}`,
      amount: input.amount,
      currency: input.currency,
    };
  }

  async verifyPayment(_input: VerifyPaymentInput): Promise<boolean> {
    return true;
  }

  async handleWebhook(rawBody: Buffer): Promise<WebhookEvent> {
    const payload = JSON.parse(rawBody.toString('utf8') || '{}');
    return {
      type: 'stub.payment.captured',
      providerOrderId: payload.providerOrderId,
      providerPaymentId: payload.providerPaymentId ?? `stub_pay_${crypto.randomUUID()}`,
      status: 'SUCCESS',
      raw: payload,
    };
  }

  async refundPayment(_input: RefundInput): Promise<RefundResult> {
    return { refundId: `stub_refund_${crypto.randomUUID()}`, status: 'processed' };
  }
}
