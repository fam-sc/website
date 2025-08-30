import {
  DataQuery,
  TableDescriptor,
  valueIn,
} from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { GlobalOptionEntry, GlobalOptionName } from '../types/globalOptions';

type EntryMap<K extends string> = Partial<Record<K, string>>;

export class GlobalOptionsCollection extends EntityCollection<GlobalOptionEntry>(
  'global_options'
) {
  static descriptor(): TableDescriptor<GlobalOptionEntry> {
    return {
      name: 'TEXT NOT NULL PRIMARY KEY',
      value: 'TEXT NOT NULL',
    };
  }

  getEntries<K extends GlobalOptionName>(names: K[]): DataQuery<EntryMap<K>> {
    return this.findManyWhereAction({ name: valueIn(names) }).map((entries) => {
      const result: EntryMap<K> = {};
      for (const { name, value } of entries) {
        result[name as K] = value;
      }

      return result;
    });
  }
}
