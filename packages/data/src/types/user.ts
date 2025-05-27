/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Binary, ObjectId } from 'mongodb';

export enum UserRole {
  STUDENT_NON_APPROVED = -1,
  STUDENT = 0,
  GROUP_HEAD = 1,
  ADMIN = 2,
}

export type User = {
  firstName: string;
  lastName: string;
  parentName: string | null;
  academicGroup: string;
  email: string;
  telnum: string | null;
  role: UserRole;
  hasAvatar?: boolean;
  passwordHash: Binary;
  telegramUserId: number | null;
};

// Info about user that has registered, but yet not clicked magic link in email.
export type PendingUser = {
  firstName: string;
  lastName: string;
  parentName: string | null;
  academicGroup: string;
  email: string;
  telnum: string | null;
  passwordHash: Binary;

  createdAt: Date;

  // Token to approve the user and move it to all other users.
  token: Binary;
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

export interface UserPersonalInfo {
  firstName: string;
  lastName: string;
  parentName: string | null;
}

export interface UserWithPassword {
  id: ObjectId;
  passwordHash: Binary;
}

export function isUserRole(role: unknown): role is UserRole {
  return (
    typeof role === 'number' &&
    role >= UserRole.STUDENT_NON_APPROVED &&
    role <= UserRole.ADMIN
  );
}
