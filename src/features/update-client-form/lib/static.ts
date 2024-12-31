import { z } from 'zod';

export const ClientUpdateSchema = z.object({
  launcherBuild: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
  version: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
  title: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
  description: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
});

export type ClientUpdateFormSchemaType = z.infer<typeof ClientUpdateSchema>;
