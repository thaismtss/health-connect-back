import { z } from 'zod';

export const LoginUserSchema = z
  .object({
    email: z.string().email().nonempty({
      message: 'Email is required and must be a valid email address',
    }),
    password: z.string().min(6).nonempty(),
  })
  .required();

export type LoginDto = z.infer<typeof LoginUserSchema>;
