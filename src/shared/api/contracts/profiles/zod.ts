import { z } from 'zod';

export const ModDetailsEntitySchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Название мода должно быть больше 2 символов' })
    .max(100, { message: 'Название мода не должно быть больше 100 символов' }),
  description: z
    .string()
    .min(2, { message: 'Описание мода должно быть больше 2 символов' })
    .max(1000, { message: 'Описание мода не должно быть больше 1000 символов' }),
});

export const CreateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Длина имени должна быть больше 2 символов' })
    .max(100, { message: 'Длина имени не должна быть больше 100 символов' }),
  displayName: z
    .string()
    .min(2, { message: 'Длина имени должна быть больше 2 символов' })
    .max(100, { message: 'Длина имени не должна быть больше 100 символов' }),
  description: z
    .string()
    .min(2, { message: 'Длина описания должна быть больше 2 символов' })
    .max(1000, {
      message: 'Длина описания не должна быть больше 1000 символов',
    }),
  version: z.string({
    errorMap: () => ({
      message: 'Не выбрана версия игры',
    }),
  }),
  loaderVersion: z.string().optional(),
  gameLoader: z.string(),
  icon: z.any(),
});

export const EditProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Длина имени должна быть больше 2 символов' })
    .max(100, { message: 'Длина имени не должна быть больше 100 символов' }),
  displayName: z
    .string()
    .min(2, { message: 'Длина имени должна быть больше 2 символов' })
    .max(100, { message: 'Длина имени не должна быть больше 100 символов' }),
  description: z
    .string()
    .min(2, { message: 'Длина описания должна быть больше 2 символов' })
    .max(255, {
      message: 'Длина описания не должна быть больше 255 символов',
    }),
  jvmArguments: z.string().optional(),
  gameArguments: z.string().optional(),
  priority: z.coerce.number().optional(),
  recommendedRam: z.coerce.number().default(50).optional(),
  icon: z.any(),
  isEnabled: z.boolean().default(true).optional(),
  background: z.any(),
});

export const RestoreProfileSchema = z.object({
  javaVersion: z.string().optional(),
});

export const EditImageProfileSchema = z.object({
  icon: z.any(),
  background: z.any(),
});

export type EditImageProfileSchemaType = z.infer<typeof EditImageProfileSchema>;
export type CreateProfileFormSchemaType = z.infer<typeof CreateProfileSchema>;
export type EditProfileFormSchemaType = z.infer<typeof EditProfileSchema>;
export type RestoreProfileSchemaType = z.infer<typeof RestoreProfileSchema>;
export type ModDetailsEntitySchemaType = z.infer<typeof ModDetailsEntitySchema>;
