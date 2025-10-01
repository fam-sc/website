import type { infer as zodInfer } from 'zod/v4-mini';

import type { setPollSpreadsheetPayload } from './payload';

export type SetPollSpreadsheetPayload = zodInfer<
  typeof setPollSpreadsheetPayload
>;
