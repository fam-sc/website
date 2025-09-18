import './routes';

import { Repository } from '@sc-fam/data';
import { setDefaultDatabase } from '@sc-fam/shared-sql/repo';
import { bot } from 'telegram-standard-bot-api';

import { app } from './routes/app';
import { handleOnCronEvent } from './scheduleHandler';

function init(env: Env) {
  Repository.setDefaultDatabase(env.DB);
  setDefaultDatabase(env.BOT_DB);
  bot.setApiKey(env.BOT_KEY);
}

export default {
  fetch(request, env) {
    init(env);

    return app.handleRequest(request, env);
  },
  scheduled(_, env) {
    init(env);

    return handleOnCronEvent();
  },
} satisfies ExportedHandler<Env>;
