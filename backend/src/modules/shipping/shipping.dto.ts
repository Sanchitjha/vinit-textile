import { z } from 'zod';

export const PincodeParamsDto = z.object({
  pincode: z.string().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit pincode'),
});

export const AwbParamsDto = z.object({
  awb: z.string().regex(/^[A-Za-z0-9-]{6,30}$/, 'Enter a valid tracking number'),
});
