import { UserRole } from '@data/types/user';

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

export type UserPersonalInfo = {
  firstName: string;
  lastName: string;
  parentName: string | null;
};

export interface UserWithRoleAndAvatar {
  id: string;
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
  id: string;
  role: UserRole;
  hasAvatar: boolean;
};
