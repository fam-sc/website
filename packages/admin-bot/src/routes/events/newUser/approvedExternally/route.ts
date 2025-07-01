import { newUserApprovedExternallyEventPayload } from '@shared/api/adminbot/types';
import { badRequest, unauthorized } from '@shared/responses';

import { isAuthorizedRequest } from '@/auth';
import { BotController } from '@/controller';
import { app } from '@/routes/app';

app.post('/events/newUser/approvedExternally', async (request, { env }) => {
  if (!isAuthorizedRequest(request, env)) {
    return unauthorized();
  }

  const rawPayload = await request.json();
  const payloadResult =
    newUserApprovedExternallyEventPayload.safeParse(rawPayload);
  if (!payloadResult.success) {
    return badRequest();
  }

  const { userId } = payloadResult.data;

  const controller = new BotController(env);
  await controller.handleNewUserApprovedExternally(userId);

  return new Response();
});
