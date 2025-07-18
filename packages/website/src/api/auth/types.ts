import { infer as zodInfer } from 'zod/v4-mini';

import type { SignInDataSchema, SignUpDataSchema } from './schema';

export type SignInData = zodInfer<typeof SignInDataSchema>;
export type SignUpData = zodInfer<typeof SignUpDataSchema>;
