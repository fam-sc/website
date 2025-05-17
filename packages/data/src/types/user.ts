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
  passwordHash: Binary;
  telegramUserId: number | null;
};

export interface UserWithRole {
  id: string;
  role: UserRole;
}

export interface ShortUser extends UserWithRole {
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
