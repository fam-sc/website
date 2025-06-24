import {
  RawUser,
  ShortUser,
  User,
  UserPersonalInfo,
  UserRole,
} from '../types/user';

import { EntityCollection } from './base';

import { notNull } from '../sqlite/modifier';
import { TableDescriptor } from '../sqlite/types';

export class UserCollection extends EntityCollection<RawUser>('users') {
  static descriptor(): TableDescriptor<RawUser> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY',
      academicGroup: 'TEXT NOT NULL',
      email: 'TEXT NOT NULL',
      firstName: 'TEXT NOT NULL',
      lastName: 'TEXT NOT NULL',
      parentName: 'TEXT',
      passwordHash: 'TEXT NOT NULL',
      role: 'INTEGER NOT NULL',
      telegramUserId: 'INTEGER',
      telnum: 'TEXT',
      hasAvatar: 'INTEGER NOT NULL',
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.findOneWhere({ email });

    return result && { ...result, hasAvatar: result.hasAvatar === 1 };
  }

  updateTelegramUserId(id: number, telegramUserId: number) {
    return this.updateWhere({ id }, { telegramUserId });
  }

  findByTelegramUserId(id: number) {
    return this.findOneWhere({ telegramUserId: id });
  }

  findAllUsersWithLinkedTelegram() {
    return this.findManyWhere({ telegramUserId: notNull() });
  }

  async findAllNonApprovedUsers(academicGroup?: string): Promise<ShortUser[]> {
    const result = await this.findManyWhere(
      academicGroup ? { academicGroup } : {},
      [
        'id',
        'academicGroup',
        'firstName',
        'lastName',
        'parentName',
        'email',
        'role',
        'hasAvatar',
      ]
    );

    return result.map(({ hasAvatar, ...rest }) => ({
      ...rest,
      hasAvatar: hasAvatar === 1,
    }));
  }

  updateRole(id: number, role: UserRole) {
    return this.updateWhere({ id }, { role });
  }

  updatePassword(id: number, passwordHash: string) {
    return this.updateWhere({ id }, { passwordHash });
  }

  updateHasAvatar(id: number, hasAvatar: boolean) {
    return this.updateWhere({ id }, { hasAvatar: hasAvatar ? 1 : 0 });
  }

  updatePersonalInfo(
    id: number,
    { firstName, lastName, parentName }: UserPersonalInfo
  ) {
    return this.updateWhere({ id }, { firstName, lastName, parentName });
  }

  async getUserAcademicGroup(id: number): Promise<string | null> {
    const result = await this.findOneWhere({ id }, ['academicGroup']);

    return result?.academicGroup ?? null;
  }

  async getPage(index: number, size: number) {
    const result = await this.selectAll(
      `SELECT firstName,lastName,parentName,academicGroup, email, role FROM users WHERE role!=${UserRole.ADMIN} OFFSET ${index * size} LIMIT ${size}`
    );

    return result.map(({ hasAvatar, ...rest }) => ({
      hasAvatar: hasAvatar === 1,
      ...rest,
    }));
  }

  getPersonalInfo(id: number): Promise<UserPersonalInfo | null> {
    return this.findOneWhere({ id }, ['firstName', 'lastName', 'parentName']);
  }
}
