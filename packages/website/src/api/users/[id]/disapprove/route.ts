import { Repository, UserRole } from '@sc-fam/data';
import { badRequest, notFound, parseInt, unauthorized } from '@sc-fam/shared';
import { middlewareHandler } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { onNewUserApprovedExternally } from '@/api/appEvents/newUser';
import { auth, userWithRoleGetter } from '@/api/authRoute';

app.post(
  '/users/:id/disapprove',
  middlewareHandler(
    auth({
      minRole: UserRole.GROUP_HEAD,
      get: userWithRoleGetter,
    }),
    async ({ env, params: { id: userId } }) => {
      const repo = Repository.openConnection();

      const numberUserId = parseInt(userId);
      if (numberUserId === undefined) {
        return badRequest({ message: 'Invalid user id' });
      }

      // TODO: It might be possible to optimize this flow - convert it into one query.
      const targetUser = await repo.users().findOneWhere({ id: numberUserId });
      if (targetUser === null) {
        return notFound();
      }

      if (targetUser.role !== UserRole.STUDENT_NON_APPROVED) {
        return unauthorized();
      }

      await repo.users().deleteWhere({ id: numberUserId }).get();
      await onNewUserApprovedExternally(numberUserId, env);

      return new Response();
    }
  )
);
