import { mediaFileExists } from '@/api/media';
import { ok, unauthrorized } from '@/api/responses';
import { UserApproveInfo } from '@/api/user/types';
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

  const usersHasAvatar = await Promise.all(
    users.map(({ id }) => mediaFileExists(`user/${id}`))
  );

  const result: UserApproveInfo[] = users.map(
    ({ id, firstName, lastName, parentName, email, academicGroup }, i) => ({
      id,
      name: formPersonName(firstName, lastName, parentName),
      email,
      group: academicGroup,
      hasAvatar: usersHasAvatar[i],
    })
  );

  return ok(result);
}
