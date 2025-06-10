export const enum UserRole {
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

export type UserPersonalInfo = {
  firstName: string;
  lastName: string;
  parentName?: string;
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

