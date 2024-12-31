import { z } from 'zod';

export const ClientDownloadSchema = z.object({
  branch: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
  host: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
  folder: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
});

export type ClientDownloadFormSchemaType = z.infer<typeof ClientDownloadSchema>;
