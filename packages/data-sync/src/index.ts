import { Repository } from '@sc-fam/data';

import { updateSitemap } from '@/sitemap';

import { syncBotFlow } from './botFlow';
import { syncDisciplines } from './disciplines';
import { syncGroups } from './groups';

export default {
  scheduled: async (_, env) => {
    Repository.setDefaultDatabase(env.DB);

    await Promise.all([
      syncGroups(),
      syncDisciplines(),
      syncBotFlow(env),
      updateSitemap(env),
    ]);
  },
} satisfies ExportedHandler<Env>;
