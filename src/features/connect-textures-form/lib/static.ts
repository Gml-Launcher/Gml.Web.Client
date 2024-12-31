import { z } from 'zod';

export const ConnectTexturesSchema = z.object({
  url_skins: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
  url_cloaks: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
});

export type ConnectTexturesFormSchemaType = z.infer<typeof ConnectTexturesSchema>;
