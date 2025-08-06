import { valueIn } from '../sqlite/modifier';
import { DataQuery } from '../sqlite/query';
import { TableDescriptor } from '../sqlite/types';
import { GlobalOptionEntry, GlobalOptionName } from '../types/globalOptions';
import { EntityCollection } from './base';

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
