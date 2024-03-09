import { z } from "zod";

export const InstallClientSchema = z.object({
  branch: z
    .string()
    .min(1, { message: "Вы не заполнили поле" })
    .transform((v) => v.trim()),
  host: z
    .string()
    .min(1, { message: "Вы не заполнили поле" })
    .transform((v) => v.trim()),
  folder: z
    .string()
    .min(1, { message: "Вы не заполнили поле" })
    .transform((v) => v.trim()),
});

export type InstallClientFormSchemaType = z.infer<typeof InstallClientSchema>;
