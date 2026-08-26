import { Schema, model } from 'mongoose';
import { IPaymentDocument } from './payment.types';

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, enum: ['RAZORPAY', 'COD'], required: true },
    providerOrderId: { type: String, required: true },
    providerPaymentId: { type: String, default: null },
    signature: { type: String, default: null, select: false },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'CREATED',
    },
    rawResponse: { type: Schema.Types.Mixed, select: false },
  },
  { timestamps: true },
);

PaymentSchema.index({ order: 1 });
PaymentSchema.index({ providerOrderId: 1 });
PaymentSchema.index({ providerPaymentId: 1 });

export const PaymentModel = model<IPaymentDocument>('Payment', PaymentSchema);
