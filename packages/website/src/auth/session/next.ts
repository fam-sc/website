import { cookies } from 'next/headers';

import { parseSessionIdString, SESSION_ID_COOKIE } from '.';

import { Repository } from '@data/repo';
import { UserRole } from '@data/types';

type UserInfo = {
  id: string;
  role: UserRole;
};

export async function getCurrentUserInfo(): Promise<UserInfo | null> {
  const cookiesSet = await cookies();
  const sessionId = parseSessionIdString(
    cookiesSet.get(SESSION_ID_COOKIE)?.value
  );
  if (sessionId === undefined) {
    return null;
  }

  await using repo = await Repository.openConnection();

  const result = await repo.sessions().getUserWithRole(sessionId);

  return result ? { id: result.id.toString(), role: result.role } : null;
}
