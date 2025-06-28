// https://github.com/kpi-ua/intellect.kpi.ua/blob/89ed5b73e1ced9e639121ec7a555d47d4ef7dd02/src/types/intellect.ts

import { z, string, object } from 'zod/v4-mini';

export type ApiResponse<T> = {
  data: T;
};

export const lecturer = object({
  userIdentifier: string(),
});

export type Lecturer = z.infer<typeof lecturer>;
