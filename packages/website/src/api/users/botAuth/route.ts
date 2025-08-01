import { Repository, UserRole } from '@sc-fam/data';
import { badRequest, unauthorized } from '@sc-fam/shared';
import { telegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/schema.js';
import { TelegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/types.js';

import { authorizeAdminBot } from '@/api/adminbot/client';
import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';
import { authorizeScheduleBot } from '@/api/schedulebot/client';

import { BotType, isBotType } from './types';

type BotInfo = {
  authorize: (payload: TelegramBotAuthPayload, env: Env) => Promise<Response>;
  updateUser: (
    users: Repository,
    id: number,
    telegramUserId: number
  ) => Promise<unknown>;

  minRole: UserRole;
};

const bots: Record<BotType, BotInfo> = {
  admin: {
    authorize: (payload, env) =>
      authorizeAdminBot(payload, env.ADMIN_BOT_ACCESS_KEY),
    updateUser: (repo, id, telegramUserId) =>
      repo.users().updateAdminBotUserId(id, telegramUserId),

    minRole: UserRole.GROUP_HEAD,
  },
  schedule: {
    authorize: (payload, env) =>
      authorizeScheduleBot(payload, env.SCHEDULE_BOT_ACCESS_KEY),
    updateUser: (repo, id, telegramUserId) =>
      repo.scheduleBotUsers().addUser(id, telegramUserId),
    minRole: UserRole.ADMIN,
  },
};

app.post('/users/botAuth', async (request, { env }) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  if (!isBotType(type)) {
    return badRequest();
  }

  const rawPayload = await request.json();

  const payloadResult = telegramBotAuthPayload.safeParse(rawPayload);
  if (!payloadResult.success) {
    return badRequest();
  }

  const payload = payloadResult.data;

  const { authorize, updateUser, minRole } = bots[type];

  const repo = Repository.openConnection();
  const user = await repo.sessions().getUserWithRole(sessionId);
  if (user === null || user.role < minRole) {
    return unauthorized();
  }

  try {
    await authorize(payload, env);
  } catch (error: unknown) {
    console.error(error);

    return unauthorized();
  }

  await updateUser(repo, user.id, payload.id);

  return new Response();
});
