import { z } from 'zod';

export const searchForm = z.object({
  name: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
});

export type SearchFormSchemaType = z.infer<typeof searchForm>;
