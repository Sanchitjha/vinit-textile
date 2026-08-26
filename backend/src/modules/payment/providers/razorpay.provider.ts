import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../../../config/env';
import { BadRequestError } from '../../../shared/errors';
import {
  CreatePaymentInput,
  CreatePaymentResult,
  IPaymentService,
  RefundInput,
  RefundResult,
  VerifyPaymentInput,
  WebhookEvent,
} from './payment-provider.interface';

export class RazorpayPaymentService implements IPaymentService {
  private readonly client: Razorpay;

  constructor() {
    this.client = new Razorpay({
      key_id: env.razorpay.keyId,
      key_secret: env.razorpay.keySecret,
    });
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const order = await this.client.orders.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency,
      receipt: input.receipt,
      notes: { orderId: input.orderId },
    });

    return {
      providerOrderId: order.id,
      amount: input.amount,
      currency: input.currency,
      keyId: env.razorpay.keyId,
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<boolean> {
    const expected = crypto
      .createHmac('sha256', env.razorpay.keySecret)
      .update(`${input.providerOrderId}|${input.providerPaymentId}`)
      .digest('hex');
    return expected === input.signature;
  }

  async handleWebhook(rawBody: Buffer, signatureHeader: string): Promise<WebhookEvent> {
    const expected = crypto
      .createHmac('sha256', env.razorpay.webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expected !== signatureHeader) {
      throw new BadRequestError('Invalid webhook signature', 'INVALID_WEBHOOK_SIGNATURE');
    }

    const payload = JSON.parse(rawBody.toString('utf8'));
    const paymentEntity = payload?.payload?.payment?.entity;
    const isSuccess = payload?.event === 'payment.captured';

    return {
      type: payload?.event ?? 'unknown',
      providerOrderId: paymentEntity?.order_id,
      providerPaymentId: paymentEntity?.id,
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      raw: payload,
    };
  }

  async refundPayment(input: RefundInput): Promise<RefundResult> {
    const refund = await this.client.payments.refund(input.providerPaymentId, {
      amount: input.amount ? Math.round(input.amount * 100) : undefined,
      notes: input.reason ? { reason: input.reason } : undefined,
    });

    return { refundId: refund.id, status: refund.status };
  }
}
