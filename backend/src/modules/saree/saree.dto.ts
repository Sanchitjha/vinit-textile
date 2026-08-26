import { z } from 'zod';

const objectId = z.string().min(1);

export const CreateSareeDto = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: objectId,
  subCategory: objectId.nullable().optional(),
  images: z.array(z.string().url()).min(1),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  discount: z.number().min(0).max(100).default(0),
  sku: z.string().min(1),
  stock: z.number().int().nonnegative().default(0),
  fabric: z.string().min(1),
  sareeType: z.string().optional(),
  weave: z.string().optional(),
  color: z.string().min(1),
  colors: z.array(z.string()).default([]),
  pattern: z.string().optional(),
  borderType: z.string().optional(),
  blousePiece: z.boolean().default(false),
  blouseColor: z.string().optional(),
  sareeLength: z.number().nonnegative().optional(),
  blouseLength: z.number().nonnegative().optional(),
  occasion: z.array(z.string()).default([]),
  region: z.string().optional(),
  tags: z.array(z.string()).default([]),
  careInstructions: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type CreateSareeDtoType = z.infer<typeof CreateSareeDto>;

export const UpdateSareeDto = CreateSareeDto.partial();
export type UpdateSareeDtoType = z.infer<typeof UpdateSareeDto>;

export const AdjustStockDto = z.object({
  quantity: z.number().int(),
});
export type AdjustStockDtoType = z.infer<typeof AdjustStockDto>;

const sortEnum = z.enum(['price_asc', 'price_desc', 'newest', 'oldest', 'rating_desc', 'name_asc']);

export const SareeQueryDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  fabric: z.string().optional(),
  sareeType: z.string().optional(),
  color: z.string().optional(),
  occasion: z.string().optional(),
  region: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sort: sortEnum.default('newest'),
});
export type SareeQueryDtoType = z.infer<typeof SareeQueryDto>;

export const SareeParamsDto = z.object({
  id: z.string().min(1),
});

export const SareeSlugParamsDto = z.object({
  slug: z.string().min(1),
});
