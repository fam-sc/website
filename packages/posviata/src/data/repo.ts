import { createRepository } from '@sc-fam/shared-sql/repo';

import { CampaignCollection } from './collections/campaign';
import { PastMediaEntryCollection } from './collections/pastMediaEntry';

export const repository = createRepository({
  campaign: CampaignCollection,
  pastMediaEntries: PastMediaEntryCollection,
});
