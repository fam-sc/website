import { UserRole } from '@data/types/user';
import { z } from 'zod';

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
