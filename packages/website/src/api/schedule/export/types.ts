import { infer as zodInfer } from 'zod/v4-mini';

import type { exportSchedulePayload } from './payloads';

export type ExportSchedulePayload = zodInfer<typeof exportSchedulePayload>;
