import { z } from 'zod';

export const CreateReviewDto = z.object({
  orderId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
  images: z.array(z.string().url()).default([]),
});
export type CreateReviewDtoType = z.infer<typeof CreateReviewDto>;

export const ReviewQueryDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ReviewQueryDtoType = z.infer<typeof ReviewQueryDto>;

export const SareeIdParamsDto = z.object({
  sareeId: z.string().min(1),
});

export const ReviewParamsDto = z.object({
  id: z.string().min(1),
});
