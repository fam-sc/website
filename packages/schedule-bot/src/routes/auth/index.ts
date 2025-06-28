import { app } from '../app';
import { scheduleBotAuthPayload } from '@shared/api/schedulebot/types';
import { verifyAuthorizationHash } from '@/auth';
import { badRequest, unauthrorized } from '@shared/responses';
import { BotController } from '@/controller';

// 5 minutes
const VALID_DURATION = 5 * 60 * 1000;

app.post('/auth', async (request, { env }) => {
  const authorization = request.headers.get('Authorization');
  if (authorization !== `Bearer ${env.ACCESS_KEY}`) {
    console.error('Invalid access key', authorization);

    return unauthrorized();
  }

  const rawPayload = await request.json();

  const payloadResult = scheduleBotAuthPayload.safeParse(rawPayload);
  if (!payloadResult.success) {
    return badRequest();
  }

  const payload = payloadResult.data;
  if (Date.now() - payload.authDate * 1000 > VALID_DURATION) {
    console.error('Stale payload');
    return unauthrorized();
  }

  const isVerified = await verifyAuthorizationHash(payload, env.BOT_KEY);

  if (isVerified) {
    await new BotController(env).handleAuth(payload.telegramUserId);

    return new Response();
  }

  return unauthrorized();
});
