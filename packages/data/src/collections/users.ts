import { and, or } from '../sqlite/conditions';
import { notNull } from '../sqlite/modifier';
import { TableDescriptor } from '../sqlite/types';
import { RawUser, ShortUser, UserPersonalInfo, UserRole } from '../types/user';
import { EntityCollection } from './base';

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
      scheduleBotUserId: 'INTEGER',
      adminBotUserId: 'INTEGER',
      telnum: 'TEXT',
      hasAvatar: 'INTEGER NOT NULL',
    };
  }

  async findUserWithPasswordByEmail(email: string) {
    const result = await this.findOneWhere({ email }, ['id', 'passwordHash']);

    return result;
  }

  updateScheduleBotUserId(id: number, telegramUserId: number) {
    return this.updateWhere({ id }, { scheduleBotUserId: telegramUserId });
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

  getRoleAndGroupById(userId: number) {
    return this.findOneWhereAction({ id: userId }, ['academicGroup', 'role']);
  }

  async findAllNonApprovedUsers(academicGroup?: string): Promise<ShortUser[]> {
    const filters = [`role=${UserRole.STUDENT_NON_APPROVED}`];
    const bindings = [];

    if (academicGroup !== undefined) {
      filters.push(`academicGroup=?`);
      bindings.push(academicGroup);
    }

    const result = await this.selectAll(
      `SELECT id, firstName, lastName, parentName, email, hasAvatar, coalesce(groups.name, '') as academicGroup
      FROM users
      RIGHT JOIN groups ON groups.campusId = users.academicGroup
      WHERE ${filters.join(' AND ')}`,
      bindings
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
      `SELECT id, firstName, lastName, parentName, coalesce(groups.name, '') as academicGroup, email, role, hasAvatar
      FROM users
      RIGHT JOIN groups ON groups.campusId = users.academicGroup
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
