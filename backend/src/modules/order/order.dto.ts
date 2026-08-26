import { z } from 'zod';
import { OrderStatus } from '../../shared/constants/orderStatus.constant';
import { PaymentMethod } from '../../shared/constants/paymentStatus.constant';

export const CreateOrderDto = z.object({
  items: z
    .array(
      z.object({
        sareeId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, 'At least one item is required'),
  addressId: z.string().min(1),
  couponCode: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});
export type CreateOrderDtoType = z.infer<typeof CreateOrderDto>;

export const UpdateOrderStatusDto = z.object({
  orderStatus: z.nativeEnum(OrderStatus),
});
export type UpdateOrderStatusDtoType = z.infer<typeof UpdateOrderStatusDto>;

export const OrderQueryDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  orderStatus: z.nativeEnum(OrderStatus).optional(),
});
export type OrderQueryDtoType = z.infer<typeof OrderQueryDto>;

export const OrderParamsDto = z.object({
  id: z.string().min(1),
});
