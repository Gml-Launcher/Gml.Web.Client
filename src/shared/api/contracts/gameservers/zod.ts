import { z } from 'zod';

export const AddGameServerScheme = z.object({
  name: z.string().min(1, { message: 'Вы не заполнили поле' }),
  address: z.string().min(1, { message: 'Вы не заполнили поле' }),
  port: z.number({ invalid_type_error: 'Вы не заполнили поле' }),
});

export type AddGameServerSchemeType = z.infer<typeof AddGameServerScheme>;
