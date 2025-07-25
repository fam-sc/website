import { DataQuery } from '../sqlite/query';
import { TableDescriptor } from '../sqlite/types';
import { Group } from '../types/common';
import { EntityCollection } from './base';

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
