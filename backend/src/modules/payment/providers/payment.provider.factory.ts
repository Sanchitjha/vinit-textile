import { env } from '../../../config/env';
import { DisabledPaymentService } from './disabled.provider';
import { IPaymentService } from './payment-provider.interface';
import { RazorpayPaymentService } from './razorpay.provider';
import { StubPaymentService } from './stub.provider';

let cachedProvider: IPaymentService | null = null;

export function getPaymentProvider(): IPaymentService {
  if (!cachedProvider) {
    if (env.razorpay.isConfigured) {
      cachedProvider = new RazorpayPaymentService();
    } else {
      // The stub accepts any payment as genuine, so it only runs when explicitly allowed (local dev).
      cachedProvider = env.razorpay.allowStub ? new StubPaymentService() : new DisabledPaymentService();
    }
  }
  return cachedProvider;
}
