import { z } from 'zod';

export const integrationSchema = z.object({
  clientId: z.string().transform((v) => v.trim()),
  details: z.string().transform((v) => v.trim()),
  largeImageKey: z.string().transform((v) => v.trim()),
  largeImageText: z.string().transform((v) => v.trim()),
  smallImageKey: z.string().transform((v) => v.trim()),
  smallImageText: z.string().transform((v) => v.trim()),
});

export type DiscordFormSchemaType = z.infer<typeof integrationSchema>;
