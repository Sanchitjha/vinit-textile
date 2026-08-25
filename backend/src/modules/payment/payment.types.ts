import { Document, Types } from 'mongoose';

export type PaymentProvider = 'RAZORPAY' | 'COD';
export type PaymentRecordStatus = 'CREATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface IPayment {
  order: Types.ObjectId;
  user: Types.ObjectId;
  provider: PaymentProvider;
  providerOrderId: string;
  providerPaymentId: string | null;
  signature: string | null;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  rawResponse: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export type IPaymentDocument = IPayment & Document;
