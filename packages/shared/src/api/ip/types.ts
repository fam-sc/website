import { infer as zodInfer } from 'zod/v4-mini';

import type { ipResponse } from './schema';

export type IpResponse = zodInfer<typeof ipResponse>;
