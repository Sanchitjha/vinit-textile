import { z } from 'zod';

export const CreateCouponDto = z.object({
  code: z.string().min(3).max(20),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.number().positive(),
  minimumOrderValue: z.number().nonnegative().default(0),
  maximumDiscount: z.number().positive().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  expiresAt: z.coerce.date(),
  isActive: z.boolean().default(true),
});
export type CreateCouponDtoType = z.infer<typeof CreateCouponDto>;

export const UpdateCouponDto = CreateCouponDto.partial();
export type UpdateCouponDtoType = z.infer<typeof UpdateCouponDto>;

export const ValidateCouponDto = z.object({
  code: z.string().min(1),
  orderValue: z.number().nonnegative(),
});
export type ValidateCouponDtoType = z.infer<typeof ValidateCouponDto>;

export const CouponParamsDto = z.object({
  id: z.string().min(1),
});
