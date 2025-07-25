import { isUserRole, Repository, UserRole } from '@sc-fam/data';
import { badRequest, notFound, parseInt, unauthorized } from '@sc-fam/shared';

import { app } from '@/api/app';
import { onNewUserApprovedExternally } from '@/api/appEvents/newUser';
import { getSessionId } from '@/api/auth';

app.post(
  '/users/:id/role',
  async (request: Request, { env, params: { id: approveUserId } }) => {
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
      return unauthorized();
    }

    const repo = Repository.openConnection();

    const userWithRole = await repo
      .sessions()
      .getUserWithRoleAndGroup(sessionId);

    if (userWithRole === null || userWithRole.role < UserRole.GROUP_HEAD) {
      return unauthorized();
    }

    const approveUser = await repo
      .users()
      .getRoleAndGroupById(numberApproveUserId)
      .get();

    if (approveUser === null) {
      return notFound();
    }

    if (userWithRole.role < UserRole.ADMIN) {
      // Non-admins can change role only for his/her group and only elevate to student.

      if (userWithRole.academicGroup !== approveUser.academicGroup) {
        return unauthorized();
      }

      if (newRole !== UserRole.STUDENT) {
        return unauthorized();
      }
    }

    const { changes } = await repo
      .users()
      .updateRole(numberApproveUserId, newRole);

    if (changes === 0) {
      return notFound();
    }

    if (approveUser.role === UserRole.STUDENT_NON_APPROVED) {
      await onNewUserApprovedExternally(numberApproveUserId, env);
    }

    return new Response();
  }
);
