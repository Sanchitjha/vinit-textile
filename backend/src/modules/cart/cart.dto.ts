import { z } from 'zod';

export const AddCartItemDto = z.object({
  sareeId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});
export type AddCartItemDtoType = z.infer<typeof AddCartItemDto>;

export const UpdateCartItemDto = z.object({
  quantity: z.number().int().positive(),
});
export type UpdateCartItemDtoType = z.infer<typeof UpdateCartItemDto>;

export const CartItemParamsDto = z.object({
  sareeId: z.string().min(1),
});
