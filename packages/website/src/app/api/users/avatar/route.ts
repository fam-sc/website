import { putMediaFile } from '@/api/media';
import { unauthrorized } from '@/api/responses';
import { getSessionIdNumber } from '@/auth/session';
import { Repository } from '@data/repo';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();

  return await repo.transaction(async (trepo) => {
    const userId = await repo.sessions().getUserIdBySessionId(sessionId);
    if (userId === null) {
      return unauthrorized();
    }

    await trepo.users().updateHasAvatar(userId, true);

    const image = await request.arrayBuffer();
    await putMediaFile(`user/${userId}`, image);

    return new NextResponse();
  });
}
