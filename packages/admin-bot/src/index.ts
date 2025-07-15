import './routes';

import { Repository } from '@data/repo';
import { bot } from 'telegram-standard-bot-api';

import { app } from './routes/app';
import { setupDevRoute } from './routes/dev/route';

export default {
  fetch(request, env) {
    bot.setApiKey(env.BOT_KEY);
    Repository.setDefaultDatabase(env.DB);

    if (DEV) {
      setupDevRoute();
    }

    return app.handleRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
