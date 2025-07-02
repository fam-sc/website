import { NewUserEventPayload } from '@shared/api/adminbot/types';

import {
  notifyNewUserCreated,
  notifyUserApprovedExternally,
} from '../adminbot/client';

export async function onNewUserCreated(
  user: NewUserEventPayload['user'],
  env: Env
) {
  await notifyNewUserCreated({ user }, env.ADMIN_BOT_ACCESS_KEY);
}

export async function onNewUserApprovedExternally(userId: number, env: Env) {
  await notifyUserApprovedExternally({ userId }, env.ADMIN_BOT_ACCESS_KEY);
}
