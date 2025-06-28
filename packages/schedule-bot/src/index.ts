import { Repository } from '@data/repo';
import { app } from './routes/app';
import { handleOnCronEvent } from './scheduleHandler';

import './routes';

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    Repository.setDefaultDatabase(env.DB);

    return app.handleRequest(request, env);
  },
  scheduled(_, env) {
    Repository.setDefaultDatabase(env.DB);

    return handleOnCronEvent(env);
  },
} satisfies ExportedHandler<Env>;
