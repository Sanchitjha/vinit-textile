import { z } from 'zod';

export const RegisterDto = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7).max(15),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type RegisterDtoType = z.infer<typeof RegisterDto>;

export const LoginDto = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginDtoType = z.infer<typeof LoginDto>;
