import { z } from 'zod';

export const integrationSchema = z.object({
  url: z.string().transform((v) => v.trim()),
});

export type SentryFormSchemaType = z.infer<typeof integrationSchema>;
