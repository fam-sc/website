import { infer as zodInfer } from 'zod/v4-mini';

import type { resetPasswordPayload } from './schema';

export type ResetPasswordPayload = zodInfer<typeof resetPasswordPayload>;
