import { newUserEventPayload } from '@shared/api/adminbot/types';
import { badRequest, unauthorized } from '@shared/responses';

import { isAuthorizedRequest } from '@/auth';
import { BotController } from '@/controller';
import { app } from '@/routes/app';

app.post('/events/newUser', async (request, { env }) => {
  if (!isAuthorizedRequest(request, env)) {
    return unauthorized();
  }

  const rawPayload = await request.json();
  const payloadResult = newUserEventPayload.safeParse(rawPayload);

  if (!payloadResult.success) {
    console.error(payloadResult.error.message);
    return badRequest();
  }

  const { user } = payloadResult.data;

  const controller = new BotController(env);
  await controller.handleNewUserEvent(user);

  return new Response();
});
