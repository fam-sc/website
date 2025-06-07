import { notFound, unauthrorized } from '@shared/responses';
import { getSessionIdNumber } from '@shared/api/auth';
import { Repository } from '@data/repo';
import { UserRole } from '@shared/api/user/types';
import { app } from '@/app';

app.post(
  '/users/:id/disapprove',
  async (request, { params: { id: userId } }) => {
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

    return await repo.transaction(async (trepo) => {
      const targetUser = await trepo.users().findById(userId);
      if (targetUser === null) {
        return notFound();
      }

      if (targetUser.role !== UserRole.STUDENT_NON_APPROVED) {
        return unauthrorized();
      }

      await trepo.users().delete(userId);

      return new Response();
    });
  }
);
