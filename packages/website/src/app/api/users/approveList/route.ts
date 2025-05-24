import { ok, unauthrorized } from '@/api/responses';
import { UserInfo } from '@/api/user/types';
import { getSessionIdNumber } from '@/auth/session';
import { formPersonName } from '@/utils/person';
import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();
  const userWithRole = await repo.sessions().getUserWithRoleAndGroup(sessionId);

  if (userWithRole === null || userWithRole.role < UserRole.GROUP_HEAD) {
    return unauthrorized();
  }

  const { role, academicGroup } = userWithRole;

  const users = await repo
    .users()
    .findAllNonApprovedUsers(
      role === UserRole.ADMIN ? undefined : academicGroup
    );

  const result: UserInfo[] = users.map((item) => ({
    id: item.id,
    name: formPersonName(item.firstName, item.lastName, item.parentName),
    email: item.email,
    group: item.academicGroup,
    hasAvatar: item.hasAvatar ?? false,
  }));

  return ok(result);
}
