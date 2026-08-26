import { Schema, model } from 'mongoose';
import { ICouponDocument } from './coupon.types';

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minimumOrderValue: { type: Number, default: 0, min: 0 },
    maximumDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0, min: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CouponModel = model<ICouponDocument>('Coupon', CouponSchema);
