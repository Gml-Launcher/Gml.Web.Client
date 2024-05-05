import { z } from "zod";

const MAX_FILE_SIZE = 1_000_000;
const ACCEPTED_IMAGE_TYPES = ["image/png"];

export const CreateProfileSchema = z.object({
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
  icon: z.any(),
});

export const EditProfileSchema = z.object({
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
  icon: z.any(),
});

export type CreateProfileFormSchemaType = z.infer<typeof CreateProfileSchema>;
export type EditProfileFormSchemaType = z.infer<typeof EditProfileSchema>;
