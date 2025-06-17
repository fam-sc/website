import { unauthrorized } from '@shared/responses';
import { getSessionIdNumber } from '@/api/auth';
import { Repository } from '@data/repo';
import { app } from '@/api/app';

app.post(
  '/users/avatar',
  async (request: Request, { env: { MEDIA_BUCKET } }) => {
    const sessionId = getSessionIdNumber(request);
    if (sessionId === undefined) {
      return unauthrorized();
    }

    await using repo = await Repository.openConnection();

    return await repo.transaction(async (trepo) => {
      const userId = await repo.sessions().getUserIdBySessionId(sessionId);
      if (userId === null) {
        return unauthrorized();
      }

      await trepo.users().updateHasAvatar(userId, true);

      const image = await request.arrayBuffer();
      await MEDIA_BUCKET.put(`user/${userId}`, image);

      return new Response();
    });
  }
);
