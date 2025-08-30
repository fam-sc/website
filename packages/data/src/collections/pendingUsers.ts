import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { PendingUser } from '../types/user';

export class PendingUserCollection extends EntityCollection<PendingUser>(
  'pending_users'
) {
  static descriptor(): TableDescriptor<PendingUser> {
    return {
      token: 'TEXT NOT NULL PRIMARY KEY',
      academicGroup: 'TEXT NOT NULL',
      createdAt: 'INTEGER NOT NULL',
      email: 'TEXT NOT NULL',
      firstName: 'TEXT NOT NULL',
      lastName: 'TEXT NOT NULL',
      parentName: 'TEXT',
      passwordHash: 'TEXT NOT NULL',
    };
  }

  findByToken(token: string) {
    return this.findOneWhere({ token });
  }

  add(value: PendingUser) {
    return this.insert(value);
  }
}
