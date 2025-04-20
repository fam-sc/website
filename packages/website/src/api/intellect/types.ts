// https://github.com/kpi-ua/intellect.kpi.ua/blob/fa831853f7b3308c2487a27fe17bb104511e7883/src/types/intellect.ts

import { z } from 'zod';

export type ApiResponse<T> = {
  data: T;
};

export const lecturer = z.object({
  profile: z.string().regex(/https:\/\/intellect.kpi.ua\/profile\/\w+/),
});

export type Lecturer = z.infer<typeof lecturer>;
