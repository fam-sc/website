import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { scheduleBotAuthPayload } from '@shared/api/schedulebot/types';
import { badRequest, unauthrorized } from '@shared/responses';

import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';
import { authorizeScheduleBot } from '@/api/schedulebot/client';

app.post('/users/scheduleBotAuth', async (request, { env }) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  const rawPayload = await request.json();

  const payloadResult = scheduleBotAuthPayload.safeParse(rawPayload);
  if (!payloadResult.success) {
    return badRequest();
  }

  const payload = payloadResult.data;

  const repo = Repository.openConnection();
  const user = await repo.sessions().getUserWithRole(sessionId);
  if (user === null || user.role < UserRole.STUDENT) {
    return unauthrorized();
  }

  try {
    await authorizeScheduleBot(payload, env.SCHEDULE_BOT_ACCESS_KEY);
  } catch (error: unknown) {
    console.error(error);

    return unauthrorized();
  }

  await repo.users().updateTelegramUserId(user.id, payload.telegramUserId);

  return new Response();
});
