import { infer as zodInfer } from 'zod/v4-mini';

import type { ipResponse } from './schema.js';

export type IpResponse = zodInfer<typeof ipResponse>;
