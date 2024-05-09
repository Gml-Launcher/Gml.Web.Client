import { z } from "zod";

export const EditSettingsPlatformSchema = z.object({
  registrationIsEnabled: z.boolean(),
  storageType: z.number(),
  storageHost: z.string(),
  storageLogin: z.string(),
  storagePassword: z.string(),
});

export type EditSettingsPlatformSchemaType = z.infer<typeof EditSettingsPlatformSchema>;
