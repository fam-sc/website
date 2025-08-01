import { infer as zodInfer } from 'zod/v4-mini';

import type { updateScheduleBotOptionsPayload } from './schema';

export type UpdateScheduleBotOptionsPayload = zodInfer<
  typeof updateScheduleBotOptionsPayload
>;
