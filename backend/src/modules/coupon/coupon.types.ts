import { Document } from 'mongoose';

export type DiscountType = 'percentage' | 'flat';

export interface ICoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ICouponDocument = ICoupon & Document;

export interface CouponValidationResult {
  coupon: ICouponDocument;
  discount: number;
}
