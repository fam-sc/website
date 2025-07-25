import { badRequest, unauthorized } from '@sc-fam/shared';
import { verifyAuthorizationHash } from '@sc-fam/shared/api/telegram/auth/index.js';
import { telegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/schema.js';

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
