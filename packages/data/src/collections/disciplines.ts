import { TableDescriptor, valueIn } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { Discipline } from '../types';

export class DisciplineCollection extends EntityCollection<Discipline>(
  'disciplines'
) {
  static descriptor(): TableDescriptor<Discipline> {
    return {
      name: 'TEXT NOT NULL PRIMARY KEY',
      link: 'TEXT',
    };
  }

  getByNames(names: string[]) {
    return this.findManyWhere({ name: valueIn(names) });
  }
}
