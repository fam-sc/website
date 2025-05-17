import { getSessionIdNumber, SESSION_ID_COOKIE } from '@/auth/session';
import { Repository } from '@data/repo';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    // We're ok with it. User is already loged out.
    return new NextResponse();
  }

  await using repo = await Repository.openConnection();
  await repo.sessions().deleteBySessionId(sessionId);

  return new NextResponse(null, {
    headers: {
      // Set empty string to session id and set expires date past current time to make browser delete it.
      'Set-Cookie': `${SESSION_ID_COOKIE}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
}
