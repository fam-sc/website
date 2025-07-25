import { badRequest, unauthorized } from '@sc-fam/shared';
import { newUserEventPayload } from '@sc-fam/shared/api/adminbot/schema.js';
import { getIpLocation } from '@sc-fam/shared/api/ip/index.js';

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
