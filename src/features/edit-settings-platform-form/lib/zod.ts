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
  // Sentry auto-clear fields
  sentryNeedAutoClear: z.boolean(),
  // TimeSpan as string (e.g., "00:05:00" or "1.00:00:00")
  sentryAutoClearPeriod: z.string(),
});

export type EditSettingsPlatformSchemaType = z.infer<typeof EditSettingsPlatformSchema>;
