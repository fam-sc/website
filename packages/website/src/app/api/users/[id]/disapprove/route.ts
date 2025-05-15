import { NextRequest } from 'next/server';
import { UserIdRouteParams } from '../types';
import { notFound, unauthrorized } from '@/api/responses';
import { getSessionIdNumber } from '@/auth/session';
import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';

export async function POST(
  request: NextRequest,
  { params }: UserIdRouteParams
) {
  const { id: userId } = await params;

  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();

  const userWithRole = await repo.sessions().getUserWithRoleAndGroup(sessionId);
  if (userWithRole === null || userWithRole.role < UserRole.GROUP_HEAD) {
    return unauthrorized();
  }

  return await repo.transaction(async (trepo) => {
    const targetUser = await trepo.users().findById(userId);
    if (targetUser === null) {
      return notFound();
    }

    if (targetUser.role !== UserRole.STUDENT_NON_APPROVED) {
      return unauthrorized();
    }

    await trepo.users().delete(userId);

    return new Response();
  });
}
