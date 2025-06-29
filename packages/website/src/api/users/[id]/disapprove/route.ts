import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { parseInt } from '@shared/parseInt';
import { badRequest, notFound, unauthrorized } from '@shared/responses';

import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';

app.post(
  '/users/:id/disapprove',
  async (request, { params: { id: userId } }) => {
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

    const numberUserId = parseInt(userId);
    if (numberUserId === undefined) {
      return badRequest({ message: 'Invalid user id' });
    }

    const targetUser = await repo.users().findOneWhere({ id: numberUserId });
    if (targetUser === null) {
      return notFound();
    }

    if (targetUser.role !== UserRole.STUDENT_NON_APPROVED) {
      return unauthrorized();
    }

    await repo.users().deleteWhere({ id: numberUserId }).get();

    return new Response();
  }
);
