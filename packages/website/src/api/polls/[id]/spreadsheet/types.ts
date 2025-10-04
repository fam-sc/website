import type { infer as zodInfer } from 'zod/v4-mini';

import type { setPollSpreadsheetPayload } from './payload';

export type PollSpreadsheetInfo = {
  name: string;
  link: string;
};

export type SetPollSpreadsheetPayload = zodInfer<
  typeof setPollSpreadsheetPayload
>;
