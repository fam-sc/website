import { newUserEventPayload } from '@shared/api/adminbot/schema';
import { getIpLocation } from '@shared/api/ip';
import { badRequest, unauthorized } from '@shared/responses';

import { isAuthorizedRequest } from '@/auth';
import { handleNewUserEvent } from '@/controller';
import { prettyIpLocation } from '@/ip';
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

  const location = user.registrationIp
    ? await getIpLocation(user.registrationIp)
    : null;

  await handleNewUserEvent({
    ...user,
    location: prettyIpLocation(location, user.registrationIp),
  });

  return new Response();
});
