import './routes';

import { Repository } from '@sc-fam/data';
import { bot } from 'telegram-standard-bot-api';

import { app } from './routes/app';
import { handleOnCronEvent } from './scheduleHandler';

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    Repository.setDefaultDatabase(env.DB);

    return app.handleRequest(request, env);
  },
  scheduled(_, env) {
    Repository.setDefaultDatabase(env.DB);
    bot.setApiKey(env.BOT_KEY);

    return handleOnCronEvent();
  },
} satisfies ExportedHandler<Env>;
