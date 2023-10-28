import z from 'zod';

export const insertGlucoseDtoSchema = z.object({
  value: z
    .string()
    .min(2, { message: 'O valor deve ter no mínimo 2 caracteres' }),
  fasting: z.boolean(),
});

export type InsertGlucoseDto = z.infer<typeof insertGlucoseDtoSchema>;
