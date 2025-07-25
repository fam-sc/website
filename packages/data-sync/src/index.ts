import { Repository } from '@sc-fam/data';

import { syncGroups } from './groups';

export default {
  scheduled: async (_, env) => {
    Repository.setDefaultDatabase(env.DB);

    await syncGroups();
  },
} satisfies ExportedHandler<Env>;
