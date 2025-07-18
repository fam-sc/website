// https://github.com/kpi-ua/intellect.kpi.ua/blob/89ed5b73e1ced9e639121ec7a555d47d4ef7dd02/src/types/intellect.ts

import { infer as zodInfer } from 'zod/v4-mini';

import type { lecturer } from './schema';

export type ApiResponse<T> = {
  data: T;
};

export type Lecturer = zodInfer<typeof lecturer>;
