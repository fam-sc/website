import { BotController } from '@/controller';
import { Update } from '@/telegram/types';
import { app } from '../app';
import { badRequest } from '@shared/responses';

app.post('/update', async (request, { env }) => {
  const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
  if (secretToken !== env.BOT_SECRET_TOKEN) {
    return badRequest();
  }

  const controller = new BotController(env);
  const update = await request.json<Update>();

  await controller.handleUpdate(update);

  return new Response();
});
