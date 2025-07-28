import { refine, string } from 'zod/v4-mini';

import { isValidSlug } from './slug';

export const slug = string().check(refine(isValidSlug));
