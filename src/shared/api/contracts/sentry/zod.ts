import { z } from 'zod';
import { addDays } from 'date-fns';

export const SentryAnalyticsScheme = z.object({
  projectType: z.number(),
  date: z
    .object({
      dateFrom: z.date(),
      dateTo: z.date(),
    })
    .refine(
      (data) => data.dateFrom > addDays(new Date(), -1),
      'Дата начала должна быть в будущем.',
    ),
});

export type SentryAnalyticsSchemeType = z.infer<typeof SentryAnalyticsScheme>;
