import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { PastMediaEntry } from '../types';

export class PastMediaEntryCollection extends EntityCollection<PastMediaEntry>(
  'past_media_entries'
) {
  static descriptor(): TableDescriptor<PastMediaEntry> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY',
      type: 'INTEGER NOT NULL',
      path: 'TEXT NOT NULL',
      year: 'INTEGER NOT NULL',
    };
  }
}
