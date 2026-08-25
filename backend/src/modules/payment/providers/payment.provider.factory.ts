import { env } from '../../../config/env';
import { IPaymentService } from './payment-provider.interface';
import { RazorpayPaymentService } from './razorpay.provider';
import { StubPaymentService } from './stub.provider';

let cachedProvider: IPaymentService | null = null;

export function getPaymentProvider(): IPaymentService {
  if (!cachedProvider) {
    cachedProvider = env.razorpay.isConfigured ? new RazorpayPaymentService() : new StubPaymentService();
  }
  return cachedProvider;
}
