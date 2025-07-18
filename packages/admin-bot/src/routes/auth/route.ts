import { verifyAuthorizationHash } from '@shared/api/telegram/auth';
import { telegramBotAuthPayload } from '@shared/api/telegram/auth/schema';
import { badRequest, unauthorized } from '@shared/responses';

import { isAuthorizedRequest } from '@/auth';
import { handleAuth } from '@/controller';

import { app } from '../app';

// 5 minutes
const VALID_DURATION = 5 * 60 * 1000;

app.post('/auth', async (request, { env }) => {
  if (!isAuthorizedRequest(request, env)) {
    return unauthorized();
  }

  const rawPayload = await request.json();

  const payloadResult = telegramBotAuthPayload.safeParse(rawPayload);
  if (!payloadResult.success) {
    return badRequest();
  }

  const payload = payloadResult.data;

  if (Date.now() - payload.auth_date * 1000 > VALID_DURATION) {
    console.error('Stale payload');
    return unauthorized();
  }

  const isVerified = await verifyAuthorizationHash(payload, env.BOT_KEY);

  if (isVerified) {
    await handleAuth(payload.id);

    return new Response();
  }

  return unauthorized();
});
