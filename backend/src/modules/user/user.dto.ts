import { z } from 'zod';

export const AddressDto = z.object({
  name: z.string().min(1),
  phone: z.string().min(7).max(15),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(3),
  country: z.string().min(1).default('India'),
  isDefault: z.boolean().default(false),
});
export type AddressDtoType = z.infer<typeof AddressDto>;

export const UpdateAddressDto = AddressDto.partial();
export type UpdateAddressDtoType = z.infer<typeof UpdateAddressDto>;

export const UpdateProfileDto = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(7).max(15).optional(),
  avatar: z.string().url().optional(),
});
export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDto>;

export const AddressParamsDto = z.object({
  id: z.string().min(1),
});
