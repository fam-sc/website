import { badRequest, notFound, unauthrorized } from '@/api/responses';
import { getSessionIdNumber } from '@/auth/session';
import { Repository } from '@data/repo';
import { isUserRole, UserRole } from '@data/types/user';
import { NextRequest, NextResponse } from 'next/server';
import { UserIdRouteParams } from '../types';

export async function POST(
  request: NextRequest,
  { params }: UserIdRouteParams
): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const newRoleRaw = searchParams.get('value');
  const newRole = newRoleRaw ? Number.parseInt(newRoleRaw) : null;

  if (!isUserRole(newRole)) {
    return badRequest();
  }

  const { id: approveUserId } = await params;

  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();

  const userWithRole = await repo.sessions().getUserWithRoleAndGroup(sessionId);

  if (userWithRole === null || userWithRole.role < UserRole.GROUP_HEAD) {
    return unauthrorized();
  }

  if (userWithRole.role < UserRole.ADMIN) {
    // Non-admins can change role only for his/her group and only elevate to student.

    const approveUserGroup = await repo
      .users()
      .getUserAcademicGroup(approveUserId);

    if (approveUserGroup === null) {
      return notFound();
    }

    if (userWithRole.academicGroup !== approveUserGroup) {
      return unauthrorized();
    }

    if (newRole !== UserRole.STUDENT) {
      return unauthrorized();
    }
  }

  const { modifiedCount } = await repo
    .users()
    .updateRole(approveUserId, newRole);

  if (modifiedCount === 0) {
    return notFound();
  }

  return new NextResponse();
}
