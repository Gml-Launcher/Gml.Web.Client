import { z } from 'zod';

export const ClientBuildSchema = z.object({
  version: z
    .string()
    .min(1, { message: 'Вы не выбрали версию' })
    .transform((v) => v.trim()),
  operatingSystem: z.array(z.string().min(1)).min(1).nonempty('Выберите хотя бы одну платформу'),
});

export type ClientBuildFormSchemaType = z.infer<typeof ClientBuildSchema>;
