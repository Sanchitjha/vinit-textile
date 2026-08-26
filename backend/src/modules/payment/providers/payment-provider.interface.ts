export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface CreatePaymentResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  keyId?: string;
}

export interface VerifyPaymentInput {
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}

export interface RefundInput {
  providerPaymentId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  status: string;
}

export interface WebhookEvent {
  type: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  status: 'SUCCESS' | 'FAILED';
  raw: unknown;
}

/**
 * Provider-agnostic payment gateway abstraction. OrderService/PaymentService
 * depend only on this interface, never on a concrete gateway SDK — satisfies
 * the dependency-inversion requirement so a future provider swap (Stripe,
 * Cashfree, etc.) touches only the providers/ folder.
 */
export interface IPaymentService {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<boolean>;
  handleWebhook(rawBody: Buffer, signatureHeader: string): Promise<WebhookEvent>;
  refundPayment(input: RefundInput): Promise<RefundResult>;
}
