import { object, string, z } from 'zod/v4-mini';

export const resetPasswordPayload = object({
  token: string(),
  newPassword: string(),
});

export type ResetPasswordPayload = z.infer<typeof resetPasswordPayload>;
