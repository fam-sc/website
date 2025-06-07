import { z } from 'zod';

export enum UserRole {
  STUDENT_NON_APPROVED = -1,
  STUDENT = 0,
  GROUP_HEAD = 1,
  ADMIN = 2,
}

export interface UserInfo {
  id: string;
  name: string;
  group: string;
  email: string;

  hasAvatar: boolean;
}

export interface UserInfoWithRole extends UserInfo {
  role: UserRole;
}

export const userPersonalInfo = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  parentName: z.string().min(1).or(z.null()),
});

export const changePasswordPayload = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export type ChangePasswordPayload = z.infer<typeof changePasswordPayload>;
