import { z } from 'zod';

export const signInSchema = z.object({
  login: z
    .string()
    .min(1, { message: 'Вы не заполнили поле' })
    .transform((v) => v.trim()),
  password: z.string().min(1, { message: 'Вы не заполнили поле' }),
});

export const signUpSchema = z
  .object({
    login: z
      .string()
      .min(3, { message: 'Имя пользователя слишком короткое' })
      .max(50, { message: 'Имя пользователя слишком длинное' })
      .transform((v) => v.trim()),
    email: z.string().email({ message: 'Некорректный email' }),
    password: z
      .string()
      .min(6, { message: 'Пароль слишком короткий' })
      .regex(/\d/, { message: 'Пароль должен содержать хотя бы одну цифру' })
      .regex(/[A-Z]/, {
        message: 'Пароль должен содержать хотя бы одну заглавную букву.',
      }),
    confirmPassword: z.string().min(6, { message: 'Повторите пароль' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Введенные пароли не совпадают',
  });

export type SignInFormSchemaType = z.infer<typeof signInSchema>;
export type SignUpFormSchemaType = z.infer<typeof signUpSchema>;
