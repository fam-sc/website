import { badRequest, notFound, unauthrorized } from '@shared/responses';
import { getSessionIdNumber } from '@shared/api/auth';
import { Repository } from '@data/repo';
import { isUserRole } from '@data/types/user';
import { UserRole } from '@shared/api/user/types';
import { app } from '@/app';

app.post(
  '/users/:id/role',
  async (request: Request, { params: { id: approveUserId } }) => {
    const { searchParams } = new URL(request.url);
    const newRoleRaw = searchParams.get('value');
    const newRole = newRoleRaw ? Number.parseInt(newRoleRaw) : null;

    // Noone can elevate user to admin.
    if (!isUserRole(newRole) || newRole === UserRole.ADMIN) {
      return badRequest();
    }

    const sessionId = getSessionIdNumber(request);
    if (sessionId === undefined) {
      return unauthrorized();
    }

    await using repo = await Repository.openConnection();

    const userWithRole = await repo
      .sessions()
      .getUserWithRoleAndGroup(sessionId);

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

    const { matchedCount } = await repo
      .users()
      .updateRole(approveUserId, newRole);

    if (matchedCount === 0) {
      return notFound();
    }

    return new Response();
  }
);
