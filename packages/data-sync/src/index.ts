import { Repository } from '@sc-fam/data';

import { syncBotFlow } from './botFlow';
import { syncGroups } from './groups';

export default {
  scheduled: async (_, env) => {
    Repository.setDefaultDatabase(env.DB);

    await Promise.all([syncGroups(), syncBotFlow(env)]);
  },
} satisfies ExportedHandler<Env>;
