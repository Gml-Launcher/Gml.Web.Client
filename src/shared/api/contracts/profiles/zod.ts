import { z } from 'zod';

const MAX_FILE_SIZE = 10_485_760;
const ACCEPTED_IMAGE_TYPES = ['image/png'];

export const createProfileSchema = z.object({
  name: z
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
  gameLoader: z.string(),
  icon: z
    .any()
    .refine((files) => files?.length == 1, 'Выберите изображение')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'Максимальный размер файла 10мб')
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Расширение файла может быть только .png',
    ),
});

export type CreateProfileFormSchemaType = z.infer<typeof createProfileSchema>;
