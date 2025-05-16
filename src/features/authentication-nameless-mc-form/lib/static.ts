import { z } from 'zod';

export const integrationSchema = z.object({
  authType: z.number(),
  endpoint: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
});

export type IntegrationFormSchemaType = z.infer<typeof integrationSchema>;
