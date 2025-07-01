import './routes';

import { Repository } from '@data/repo';

import { app } from './routes/app';
import { setupDevRoute } from './routes/dev/route';

export default {
  fetch(request, env) {
    Repository.setDefaultDatabase(env.DB);

    if (DEV) {
      setupDevRoute();
    }

    return app.handleRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
