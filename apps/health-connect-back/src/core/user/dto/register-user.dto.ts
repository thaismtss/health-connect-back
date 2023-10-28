import { z } from 'zod';

export const RegisterUserSchema = z
  .object({
    email: z.string().email().nonempty({
      message: 'Email is required and must be a valid email address',
    }),
    password: z.string().min(6).nonempty(),
    name: z.string().nonempty(),
  })
  .required();

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
