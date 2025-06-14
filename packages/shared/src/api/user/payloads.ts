import { z } from 'zod/v4-mini';

const nonEmptyString = z.string().check(z.minLength(1));

export const userPersonalInfo = z.object({
  firstName: nonEmptyString,
  lastName: nonEmptyString,
  parentName: z.nullable(nonEmptyString),
});

export const changePasswordPayload = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export type ChangePasswordPayload = z.infer<typeof changePasswordPayload>;
