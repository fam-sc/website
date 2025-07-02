import { getApiSecretToken } from '@shared/api/telegram/request';
import { Update } from '@shared/api/telegram/types';
import { badRequest } from '@shared/responses';

import { BotController } from '@/controller';

import { app } from '../app';

app.post('/update', async (request, { env }) => {
  const secretToken = getApiSecretToken(request);
  if (secretToken !== env.BOT_SECRET_TOKEN) {
    return badRequest();
  }

  const controller = new BotController(env);
  const update = await request.json<Update>();

  await controller.handleUpdate(update);

  return new Response();
});
