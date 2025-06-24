import { badRequest, notFound, unauthrorized } from '@shared/responses';
import { getSessionId } from '@/api/auth';
import { Repository } from '@data/repo';
import { isUserRole } from '@data/types/user';
import { UserRole } from '@data/types/user';
import { app } from '@/api/app';
import { parseInt } from '@shared/parseInt';

app.post(
  '/users/:id/role',
  async (request: Request, { params: { id: approveUserId } }) => {
    const { searchParams } = new URL(request.url);
    const newRoleRaw = searchParams.get('value');
    const newRole = newRoleRaw ? Number.parseInt(newRoleRaw) : null;

    const numberApproveUserId = parseInt(approveUserId);

    // No one can elevate user to admin.
    if (
      !isUserRole(newRole) ||
      newRole === UserRole.ADMIN ||
      numberApproveUserId === undefined
    ) {
      return badRequest();
    }

    const sessionId = getSessionId(request);
    if (sessionId === undefined) {
      return unauthrorized();
    }

    const repo = Repository.openConnection();

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
        .getUserAcademicGroup(numberApproveUserId);

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

    const { changes } = await repo
      .users()
      .updateRole(numberApproveUserId, newRole);

    if (changes === 0) {
      return notFound();
    }

    return new Response();
  }
);
