import { badRequest, unauthrorized } from '@/api/responses';
import { userPersonalInfo } from '@/api/user/types';
import { getSessionIdNumber } from '@/auth/session';
import { Repository } from '@data/repo';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const bodyObject = await request.json();
  const piResult = userPersonalInfo.safeParse(bodyObject);
  if (piResult.error) {
    console.error(piResult.error);

    return badRequest();
  }

  const personalInfo = piResult.data;

  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();

  return await repo.transaction(async (trepo) => {
    const session = await trepo.sessions().findBySessionId(sessionId);
    if (session === null) {
      return unauthrorized();
    }

    await repo.users().updatePersonalInfo(session.userId, personalInfo);

    return new NextResponse();
  });
}
