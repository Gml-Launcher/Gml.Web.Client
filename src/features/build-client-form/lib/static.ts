import { version } from "os";
import { z } from "zod";

export const ClientBuildSchema = z.object({
  branch: z
    .string()
    .min(1, { message: "Вы не заполнили поле" })
    .transform((v) => v.trim()),
});

export type ClientBuildFormSchemaType = z.infer<typeof ClientBuildSchema>;
