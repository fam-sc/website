import { cookies } from 'next/headers';

import { parseSessionIdString, SESSION_ID_COOKIE } from '@shared/api/auth';

export async function getCurrentSessionId(): Promise<bigint | undefined> {
  const cookiesSet = await cookies();

  return parseSessionIdString(cookiesSet.get(SESSION_ID_COOKIE)?.value);
}
