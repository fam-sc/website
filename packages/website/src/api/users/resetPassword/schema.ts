import { object, string } from 'zod/v4-mini';

export const resetPasswordPayload = object({
  token: string(),
  newPassword: string(),
});
