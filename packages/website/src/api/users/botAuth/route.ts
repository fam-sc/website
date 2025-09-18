import { Repository, UserRole } from '@sc-fam/data';
import { unauthorized } from '@sc-fam/shared';
import { telegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/schema.js';
import { TelegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/types.js';
import { invalid, validator } from '@sc-fam/shared/minivalidate';
import {
  middlewareHandler,
  searchParams,
  zodSchema,
} from '@sc-fam/shared/router';

import { authorizeAdminBot } from '@/api/adminbot/client';
import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';
import { ApiErrorCode } from '@/api/errorCodes';
import { authorizeScheduleBot } from '@/api/schedulebot/client';

import { BotType, isBotType } from './types';

type BotInfo = {
  authorize: (payload: TelegramBotAuthPayload, env: Env) => Promise<Response>;
  hasUser: (repo: Repository, telegramUserId: number) => Promise<boolean>;
  updateUser: (
    users: Repository,
    id: number,
    telegramUserId: number
  ) => Promise<unknown>;

  minRole: UserRole;
};

const bots: Record<BotType, BotInfo> = {
  admin: {
    minRole: UserRole.GROUP_HEAD,
    authorize: (payload, env) =>
      authorizeAdminBot(payload, env.ADMIN_BOT_ACCESS_KEY),
    hasUser: (repo, telegramUserId) =>
      repo.users().hasUserWithAdminBotTelegramId(telegramUserId),
    updateUser: (repo, id, telegramUserId) =>
      repo.users().updateAdminBotUserId(id, telegramUserId),
  },
  schedule: {
    minRole: UserRole.STUDENT,
    authorize: (payload, env) =>
      authorizeScheduleBot(payload, env.SCHEDULE_BOT_ACCESS_KEY),
    hasUser: (repo, telegramUserId) =>
      repo.scheduleBotUsers().hasUserByTelegramId(telegramUserId),
    updateUser: (repo, userId, telegramId) =>
      repo.scheduleBotUsers().addUser({ telegramId, userId }),
  },
};

app.post(
  '/users/botAuth',
  middlewareHandler(
    searchParams({
      type: validator((input) => (isBotType(input) ? input : invalid())),
    }),
    zodSchema(telegramBotAuthPayload),
    async ({ request, data: [{ type }, payload], env }) => {
      const sessionId = getSessionId(request);
      if (sessionId === undefined) {
        return unauthorized();
      }

      const { authorize, updateUser, hasUser, minRole } = bots[type];

      const repo = Repository.openConnection();
      const user = await repo.sessions().getUserWithRole(sessionId);
      if (user === null || user.role < minRole) {
        return unauthorized();
      }

      const userExists = await hasUser(repo, payload.id);
      if (userExists) {
        return unauthorized({
          code: ApiErrorCode.TELEGRAM_USER_ALREADY_LINKED,
          message: 'Telegram user already linked',
        });
      }

      try {
        await authorize(payload, env);
      } catch (error: unknown) {
        console.error(error);

        return unauthorized();
      }

      await updateUser(repo, user.id, payload.id);

      return new Response();
    }
  )
);
