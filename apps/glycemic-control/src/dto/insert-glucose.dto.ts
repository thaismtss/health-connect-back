import z from 'zod';

export const insertGlucoseDtoSchema = z.object({
  value: z.number().min(0).max(1000),
  fasting: z.boolean(),
});

export type InsertGlucoseDto = z.infer<typeof insertGlucoseDtoSchema>;
