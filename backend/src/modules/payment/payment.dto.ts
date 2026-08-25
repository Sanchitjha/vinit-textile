import { z } from 'zod';

export const InitiatePaymentParamsDto = z.object({
  orderId: z.string().min(1),
});

export const VerifyPaymentDto = z.object({
  providerOrderId: z.string().min(1),
  providerPaymentId: z.string().min(1),
  signature: z.string().min(1),
});
export type VerifyPaymentDtoType = z.infer<typeof VerifyPaymentDto>;

export const RefundParamsDto = z.object({
  orderId: z.string().min(1),
});
