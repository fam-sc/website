import { verifyAuthorizationHash } from '@shared/api/telegram/auth';
import { telegramBotAuthPayload } from '@shared/api/telegram/auth/schema';
import { badRequest, unauthorized } from '@shared/responses';
import { bot } from 'telegram-standard-bot-api';

import { handleAuth } from '@/controller';

import { app } from '../app';

// 5 minutes
const VALID_DURATION = 5 * 60 * 1000;

app.post('/auth', async (request, { env }) => {
  const authorization = request.headers.get('Authorization');
  if (authorization !== `Bearer ${env.ACCESS_KEY}`) {
    console.error('Invalid access key', authorization);

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
    bot.setApiKey(env.BOT_KEY);
    await handleAuth(payload.id);

    return new Response();
  }

  return unauthorized();
});
