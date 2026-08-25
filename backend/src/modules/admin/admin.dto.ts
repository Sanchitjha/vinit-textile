import { z } from 'zod';

export const AdminUserQueryDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});
export type AdminUserQueryDtoType = z.infer<typeof AdminUserQueryDto>;

export const UpdateUserStatusDto = z.object({
  isActive: z.boolean(),
});
export type UpdateUserStatusDtoType = z.infer<typeof UpdateUserStatusDto>;

export const AdminUserParamsDto = z.object({
  id: z.string().min(1),
});
