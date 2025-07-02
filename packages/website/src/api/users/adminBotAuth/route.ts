import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { telegramBotAuthPayload } from '@shared/api/telegram/auth';
import { badRequest, unauthorized } from '@shared/responses';

import { authorizeAdminBot } from '@/api/adminbot/client';
import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';

app.post('/users/adminBotAuth', async (request, { env }) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthorized();
  }

  const rawPayload = await request.json();

  const payloadResult = telegramBotAuthPayload.safeParse(rawPayload);
  if (!payloadResult.success) {
    return badRequest();
  }

  const payload = payloadResult.data;

  const repo = Repository.openConnection();
  const user = await repo.sessions().getUserWithRole(sessionId);
  if (user === null || user.role < UserRole.STUDENT) {
    return unauthorized();
  }

  try {
    await authorizeAdminBot(payload, env.ADMIN_BOT_ACCESS_KEY);
  } catch (error: unknown) {
    console.error(error);

    return unauthorized();
  }

  await repo.users().updateAdminBotUserId(user.id, payload.telegramUserId);

  return new Response();
});
