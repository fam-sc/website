import { DataQuery, TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { Group } from '../types/common';

export class GroupCollection extends EntityCollection<Group>('groups') {
  static descriptor(): TableDescriptor<Group> {
    return {
      name: 'TEXT NOT NULL',
      campusId: 'TEXT NOT NULL',
    };
  }

  insertOrUpdateAll(groups: Group[]) {
    return this.insertOrReplaceManyAction(groups);
  }

  findByName(name: string) {
    return this.findOneWhereAction({ name });
  }

  groupExists(name: string): DataQuery<boolean> {
    return this.count({ name }).map((result) => result > 0);
  }
}
