import { cookies } from 'next/headers';

import { parseSessionIdString, SESSION_ID_COOKIE } from '.';

import { Repository } from '@data/repo';
import { UserRole } from '@data/types';

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const cookiesSet = await cookies();
  const sessionId = parseSessionIdString(
    cookiesSet.get(SESSION_ID_COOKIE)?.value
  );
  if (sessionId === undefined) {
    return null;
  }

  await using repo = await Repository.openConnection();

  return await repo.sessions().getUserRole(sessionId);
}
