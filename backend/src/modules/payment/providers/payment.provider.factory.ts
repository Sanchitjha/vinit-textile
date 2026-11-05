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
      // The stub accepts any payment as genuine, so it must never run in production.
      cachedProvider = env.isProduction ? new DisabledPaymentService() : new StubPaymentService();
    }
  }
  return cachedProvider;
}
