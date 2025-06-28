import { string, object, nullable, minLength, z } from 'zod/v4-mini';

const nonEmptyString = string().check(minLength(1));

export const userPersonalInfo = object({
  firstName: nonEmptyString,
  lastName: nonEmptyString,
  parentName: nullable(nonEmptyString),
});

export const changePasswordPayload = object({
  oldPassword: string(),
  newPassword: string(),
});

export type ChangePasswordPayload = z.infer<typeof changePasswordPayload>;
