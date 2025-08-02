import { isUserRole, Repository, UserRole } from '@sc-fam/data';
import { badRequest, notFound, parseInt, unauthorized } from '@sc-fam/shared';
import { invalid } from '@sc-fam/shared/minivalidate';
import {
  int,
  middlewareHandler,
  params,
  searchParams,
} from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { onNewUserApprovedExternally } from '@/api/appEvents/newUser';
import { auth, userWithRoleGetter } from '@/api/authRoute';

app.post(
  '/users/:id/role',
  middlewareHandler(
    params({ id: int(badRequest) }),
    searchParams({
      value: (input) => {
        const int = parseInt(input);

        return int !== undefined && isUserRole(int) ? int : invalid();
      },
    }),
    auth({ minRole: UserRole.GROUP_HEAD, get: userWithRoleGetter }),
    async ({
      env,
      data: [{ id: approveUserId }, { value: newRole }, userWithRole],
    }) => {
      // No one can elevate user to admin.
      if (newRole === UserRole.ADMIN) {
        return badRequest();
      }

      const repo = Repository.openConnection();

      const approveUser = await repo
        .users()
        .getRoleAndGroupById(approveUserId)
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

      const { changes } = await repo.users().updateRole(approveUserId, newRole);

      if (changes === 0) {
        return notFound();
      }

      if (approveUser.role === UserRole.STUDENT_NON_APPROVED) {
        await onNewUserApprovedExternally(approveUserId, env);
      }

      return new Response();
    }
  )
);
