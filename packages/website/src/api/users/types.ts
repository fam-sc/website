import { UserRole } from '@data/types/user';
import { infer as zodInfer } from 'zod/v4-mini';

import type { changePasswordPayload } from './payloads';

export interface UserInfo {
  id: number;
  name: string;
  group: string;
  email: string;

  hasAvatar: boolean;
}

export interface UserInfoWithRole extends UserInfo {
  role: UserRole;
}

export type UserPersonalInfo = {
  firstName: string;
  lastName: string;
  parentName: string | null;
};

export interface UserWithRoleAndAvatar {
  id: number;
  role: UserRole;
  hasAvatar?: boolean;
}

export interface ShortUser extends UserWithRoleAndAvatar {
  firstName: string;
  lastName: string;
  parentName: string | null;
  academicGroup: string;
  email: string;
}

export type UserSelfInfo = {
  id: number;
  role: UserRole;
  hasAvatar: boolean;
};

export type ChangePasswordPayload = zodInfer<typeof changePasswordPayload>;
