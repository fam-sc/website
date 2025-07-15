import { TableDescriptor } from '../sqlite/types';
import { AuthSession } from '../types';
import { User, UserPersonalInfo, UserWithRoleAndAvatar } from '../types/user';
import { EntityCollection } from './base';

export class SessionCollection extends EntityCollection<AuthSession>(
  'sessions'
) {
  static descriptor(): TableDescriptor<AuthSession> {
    return {
      sessionId: 'TEXT NOT NULL PRIMARY KEY',
      userId: 'INTEGER NOT NULL',
    };
  }

  async findBySessionId(sessionId: string) {
    return this.findOneWhere({ sessionId });
  }

  async deleteBySessionId(sessionId: string) {
    return this.deleteWhere({ sessionId }).get();
  }

  async getUserIdBySessionId(sessionId: string): Promise<number | null> {
    const result = await this.findOneWhere({ sessionId }, ['userId']);

    return result?.userId ?? 0;
  }

  private async getUserBase<K extends keyof User>(
    sessionId: string,
    projection: K[]
  ): Promise<Pick<User, K> | null> {
    const fields = projection
      .map((variable) => `users.${variable} as ${variable}`)
      .join(',');

    return this.selectOne(
      `SELECT ${fields} FROM sessions INNER JOIN users ON users.id = sessions.userId WHERE sessions.sessionId = ?`,
      [sessionId]
    );
  }

  async getUserWithRole(
    sessionId: string
  ): Promise<UserWithRoleAndAvatar | null> {
    return this.getUserBase(sessionId, ['id', 'role', 'hasAvatar']);
  }

  async getUserWithRoleAndGroup(sessionId: string) {
    return this.getUserBase(sessionId, [
      'id',
      'role',
      'hasAvatar',
      'academicGroup',
    ]);
  }

  async sessionExists(sessionId: string): Promise<boolean> {
    const count = await this.count({ sessionId }).get();

    return count > 0;
  }

  async getUserPersonalInfo(
    sessionId: string
  ): Promise<UserPersonalInfo | null> {
    return this.getUserBase(sessionId, ['firstName', 'lastName', 'parentName']);
  }

  async getUserWithPassword(sessionId: string) {
    return await this.getUserBase(sessionId, ['id', 'passwordHash']);
  }
}
