import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { parseInt } from '@shared/parseInt';
import { badRequest, notFound, unauthorized } from '@shared/responses';

import { app } from '@/api/app';
import { onNewUserApprovedExternally } from '@/api/appEvents/newUser';
import { getSessionId } from '@/api/auth';

app.post(
  '/users/:id/disapprove',
  async (request, { env, params: { id: userId } }) => {
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
);
