import { z } from "zod";

export const createProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Длина имени должна быть больше 2 символов" })
    .max(100, { message: "Длина имени не должна быть больше 100 символов" }),
  description: z
    .string()
    .min(2, { message: "Длина описания должна быть больше 2 символов" })
    .max(1000, {
      message: "Длина описания не должна быть больше 1000 символов",
    }),
  version: z.string({
    errorMap: () => ({
      message: "Не выбрана версия игры",
    }),
  }),
  gameLoader: z.string(),
  iconBase64: z
    .string()
    .min(2, { message: "Длина Base64 должна быть больше 2 символов" })
    .max(1000, {
      message: "Длина Base64 не должна быть больше 20000 символов",
    }),
});

export type CreateProfileFormSchemaType = z.infer<typeof createProfileSchema>;
