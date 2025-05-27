import { getSessionIdNumber } from '@/auth/session';
import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { NextRequest, NextResponse } from 'next/server';
import { unauthrorized } from './responses';

export async function authRoute(
  request: NextRequest,
  minRole: UserRole,
  block: (repo: Repository, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();
  const userWithRole = await repo.sessions().getUserWithRole(sessionId);

  if (userWithRole === null || userWithRole.role < minRole) {
    return unauthrorized();
  }

  return await block(repo, userWithRole.id);
}
