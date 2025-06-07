import { parseCronTimeToLocal } from './cron';
import auth from './routes/auth';
import update from './routes/update';
import { handleOnTime } from './scheduleHandler';
import { RouteMap, handleRoute } from '@shared/route/simple';

const routes: RouteMap<Env> = {
  '/auth': auth,
  '/update': update,
};

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRoute(request, env, routes);
  },
  async scheduled(controller, env) {
    const time = parseCronTimeToLocal(controller.cron);

    await handleOnTime(time, env);
  },
} satisfies ExportedHandler<Env>;
