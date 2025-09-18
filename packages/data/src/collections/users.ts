import { and, notNull, or, TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { RawUser, ShortUser, UserPersonalInfo, UserRole } from '../types/user';

export class UserCollection extends EntityCollection<RawUser>('users') {
  static descriptor(): TableDescriptor<RawUser> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
      academicGroup: 'TEXT NOT NULL',
      email: 'TEXT NOT NULL',
      firstName: 'TEXT NOT NULL',
      lastName: 'TEXT NOT NULL',
      parentName: 'TEXT',
      passwordHash: 'TEXT NOT NULL',
      role: 'INTEGER NOT NULL',
      adminBotUserId: 'INTEGER',
      hasAvatar: 'INTEGER NOT NULL',
    };
  }

  add(value: Omit<RawUser, 'id'>) {
    return this.insert(value, 'id');
  }

  async findUserWithPasswordByEmail(email: string) {
    const result = await this.findOneWhere({ email }, ['id', 'passwordHash']);

    return result;
  }

  updateAdminBotUserId(id: number, telegramUserId: number) {
    return this.updateWhere({ id }, { adminBotUserId: telegramUserId });
  }

  findByAdminBotUserId(id: number) {
    return this.findOneWhere({ adminBotUserId: id });
  }

  findAllUsersWithLinkedAdminBot(academicGroup: string) {
    return this.findManyWhere(
      and(
        { adminBotUserId: notNull() },
        or<RawUser>(
          { role: UserRole.ADMIN },
          { role: UserRole.GROUP_HEAD, academicGroup }
        )
      ),
      ['id', 'academicGroup', 'adminBotUserId']
    );
  }

  getRoleAndGroupByAdminBotUserId(userId: number) {
    return this.findOneWhereAction({ adminBotUserId: userId }, [
      'academicGroup',
      'role',
    ]);
  }

  async hasUserWithAdminBotTelegramId(telegramId: number) {
    const count = await this.count({ adminBotUserId: telegramId }).get();

    return count > 0;
  }

  getRoleAndGroupById(userId: number) {
    return this.findOneWhereAction({ id: userId }, ['academicGroup', 'role']);
  }

  async findAllNonApprovedUsers(academicGroup?: string): Promise<ShortUser[]> {
    const result = await this.findManyWhere(
      { academicGroup, role: UserRole.STUDENT_NON_APPROVED },
      [
        'id',
        'firstName',
        'lastName',
        'parentName',
        'email',
        'role',
        'hasAvatar',
        'academicGroup',
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

  updateRoleIfNonApprovedUser(id: number, role: UserRole) {
    return this.updateWhere(
      { id, role: UserRole.STUDENT_NON_APPROVED },
      { role }
    );
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
      `SELECT id, firstName, lastName, parentName, academicGroup, email, role, hasAvatar
      FROM users
      WHERE role != ${UserRole.ADMIN}
      LIMIT ${size} OFFSET ${index * size}`
    );

    return result.map(({ hasAvatar, ...rest }) => ({
      hasAvatar: hasAvatar === 1,
      ...rest,
    }));
  }

  getPersonalInfo(id: number): Promise<UserPersonalInfo | null> {
    return this.findOneWhere({ id }, ['firstName', 'lastName', 'parentName']);
  }

  async userWithEmailExists(email: string): Promise<boolean> {
    const count = await this.count({ email }).get();

    return count > 0;
  }
}
