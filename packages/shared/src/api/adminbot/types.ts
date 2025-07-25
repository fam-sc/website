import { infer as zodInfer } from 'zod/v4-mini';

import type {
  newUserApprovedExternallyEventPayload,
  newUserEventPayload,
} from './schema.js';

export type NewUserEventPayload = zodInfer<typeof newUserEventPayload>;
export type NewUserApprovedExternallyEventPayload = zodInfer<
  typeof newUserApprovedExternallyEventPayload
>;
