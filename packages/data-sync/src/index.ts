import { Repository } from '@data/repo';

import { syncGroups } from './groups';

export default {
  scheduled: async (_, env) => {
    Repository.setDefaultDatabase(env.DB);

    await syncGroups();
  },
} satisfies ExportedHandler<Env>;
