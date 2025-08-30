import { DataQuery, TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { Group } from '../types/common';

export class GroupCollection extends EntityCollection<Group>('groups') {
  static descriptor(): TableDescriptor<Group> {
    return {
      campusId: 'TEXT NOT NULL PRIMARY KEY',
      name: 'TEXT NOT NULL',
    };
  }

  insertOrUpdateAll(groups: Group[]) {
    return this.insertOrReplaceManyAction(groups);
  }

  findByCampusId(campusId: string) {
    return this.findOneWhereAction({ campusId });
  }

  groupExists(campusId: string): DataQuery<boolean> {
    return this.count({ campusId }).map((result) => result > 0);
  }
}
