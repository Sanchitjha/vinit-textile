import { z } from 'zod';

export const CreateCategoryDto = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentCategory: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});
export type CreateCategoryDtoType = z.infer<typeof CreateCategoryDto>;

export const UpdateCategoryDto = CreateCategoryDto.partial();
export type UpdateCategoryDtoType = z.infer<typeof UpdateCategoryDto>;

export const CategoryQueryDto = z.object({
  parentCategory: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  tree: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});
export type CategoryQueryDtoType = z.infer<typeof CategoryQueryDto>;

export const CategoryParamsDto = z.object({
  id: z.string().min(1),
});
