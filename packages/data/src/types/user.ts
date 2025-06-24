/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
export const enum UserRole {
  STUDENT_NON_APPROVED = -1,
  STUDENT = 0,
  GROUP_HEAD = 1,
  ADMIN = 2,
}

export type RawUser = {
  id: number;
  firstName: string;
  lastName: string;
  parentName: string | null;
  academicGroup: string;
  email: string;
  telnum: string | null;
  role: UserRole;
  hasAvatar: number;
  passwordHash: string;
  telegramUserId: number | null;
};

export type User = Omit<RawUser, 'hasAvatar'> & {
  hasAvatar: boolean;
};

// Info about user that has registered, but yet not clicked magic link in email.
export type PendingUser = {
  id: number;
  firstName: string;
  lastName: string;
  parentName: string | null;
  academicGroup: string;
  email: string;
  telnum: string | null;
  passwordHash: string;

  createdAt: number;

  // Token to approve the user and move it to all other users.
  token: string;
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

export interface UserPersonalInfo {
  firstName: string;
  lastName: string;
  parentName: string | null;
}

export interface UserWithPassword {
  id: number;
  passwordHash: string;
}

export function isUserRole(role: unknown): role is UserRole {
  return (
    typeof role === 'number' &&
    role >= UserRole.STUDENT_NON_APPROVED &&
    role <= UserRole.ADMIN
  );
}
