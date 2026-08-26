import { z } from 'zod';

export const WishlistParamsDto = z.object({
  sareeId: z.string().min(1),
});
