import { infer as zodInfer } from 'zod/v4-mini';

import type { forgotPasswordPayload } from './schema';

export type ForgotPasswordPayload = zodInfer<typeof forgotPasswordPayload>;
