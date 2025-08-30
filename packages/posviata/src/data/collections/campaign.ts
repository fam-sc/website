import { TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { CampaignEntry } from '../types';

export class CampaignCollection extends EntityCollection<CampaignEntry>(
  'campaign'
) {
  static descriptor(): TableDescriptor<CampaignEntry> {
    return {
      request_id: 'TEXT NOT NULL PRIMARY KEY',
      referrer: 'INTEGER',
      start_time: 'INTEGER NOT NULL',
      user_agent: 'TEXT',
      validation_time: 'INTEGER',
      registration_place: 'INTEGER',
    };
  }
}
