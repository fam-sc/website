import { TableDescriptor } from '../sqlite/types';
import { PendingUser } from '../types/user';
import { EntityCollection } from './base';

export class PendingUserCollection extends EntityCollection<PendingUser>(
  'pending_users'
) {
  static descriptor(): TableDescriptor<PendingUser> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY',
      academicGroup: 'TEXT NOT NULL',
      createdAt: 'INTEGER NOT NULL',
      email: 'TEXT NOT NULL',
      firstName: 'TEXT NOT NULL',
      lastName: 'TEXT NOT NULL',
      parentName: 'TEXT',
      passwordHash: 'TEXT NOT NULL',
      telnum: 'TEXT',
      token: 'TEXT NOT NULL',
    };
  }

  findByToken(token: string) {
    return this.findOneWhere({ token });
  }
}
