import { cookies } from 'next/headers';

import { parseSessionIdString, SESSION_ID_COOKIE } from '.';

import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';

type UserInfo = {
  id: string;
  role: UserRole;
  hasAvatar: boolean;
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
  const result = await repo.sessions().getUserWithRole(sessionId);

  return result
    ? { id: result.id, role: result.role, hasAvatar: result.hasAvatar ?? false }
    : null;
}
