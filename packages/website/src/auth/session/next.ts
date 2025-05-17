import { cookies } from 'next/headers';

import { parseSessionIdString, SESSION_ID_COOKIE } from '.';

import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';

type UserInfo = {
  id: string;
  role: UserRole;
};

export async function getCurrentSessionId(): Promise<bigint | undefined> {
  const cookiesSet = await cookies();

  return parseSessionIdString(cookiesSet.get(SESSION_ID_COOKIE)?.value);
}

export async function getCurrentUserInfo(): Promise<UserInfo | null> {
  const sessionId = await getCurrentSessionId();
  if (sessionId === undefined) {
    return null;
  }

  await using repo = await Repository.openConnection();

  return await repo.sessions().getUserWithRole(sessionId);
}
