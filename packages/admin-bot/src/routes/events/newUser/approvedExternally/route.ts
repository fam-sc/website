import { newUserApprovedExternallyEventPayload } from '@shared/api/adminbot/schema';
import { badRequest, unauthorized } from '@shared/responses';

import { isAuthorizedRequest } from '@/auth';
import { handleNewUserApprovedExternally } from '@/controller';
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

  await handleNewUserApprovedExternally(userId);

  return new Response();
});
