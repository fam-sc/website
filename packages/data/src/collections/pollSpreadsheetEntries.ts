import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { PollSpreadsheetEntry } from '../types';

export class PollSpreadsheetEntryCollection extends EntityCollection<PollSpreadsheetEntry>(
  'poll_spreadsheet_entries'
) {
  static descriptor(): TableDescriptor<PollSpreadsheetEntry> {
    return {
      spreadsheetId: 'TEXT NOT NULL',
      userId: 'INTEGER NOT NULL',
    };
  }

  addEntries(spreadsheetId: string, userIds: number[]) {
    return this.insertMany(
      userIds.map((userId) => ({ spreadsheetId, userId }))
    );
  }
}
