import { getApiSecretToken } from '@shared/api/telegram/request';
import { badRequest } from '@shared/responses';
import { bot } from 'telegram-standard-bot-api';
import { Update } from 'telegram-standard-bot-api/types';

import { handleUpdate } from '@/controller';

import { app } from '../app';

app.post('/update', async (request, { env }) => {
  const secretToken = getApiSecretToken(request);
  if (secretToken !== env.BOT_SECRET_TOKEN) {
    return badRequest();
  }

  const update = await request.json<Update>();

  bot.setApiKey(env.BOT_KEY);
  await handleUpdate(update);

  return new Response();
});
