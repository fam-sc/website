import { object, string } from 'zod/v4-mini';

export const lecturer = object({
  userIdentifier: string(),
});
