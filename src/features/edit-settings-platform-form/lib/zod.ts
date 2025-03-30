import { z } from 'zod';

export const EditSettingsPlatformSchema = z.object({
  registrationIsEnabled: z.boolean(),
  storageType: z.number(),
  storageHost: z.string(),
  curseForgeKey: z.string(),
  vkKey: z.string(),
  storageLogin: z.string(),
  storagePassword: z.string(),
  textureProtocol: z.number(),
});

export type EditSettingsPlatformSchemaType = z.infer<typeof EditSettingsPlatformSchema>;
