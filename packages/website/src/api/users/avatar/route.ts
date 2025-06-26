import { unauthrorized } from '@shared/responses';
import { getSessionId } from '@/api/auth';
import { Repository } from '@data/repo';
import { app } from '@/api/app';

app.post(
  '/users/avatar',
  async (request: Request, { env: { MEDIA_BUCKET } }) => {
    const sessionId = getSessionId(request);
    if (sessionId === undefined) {
      return unauthrorized();
    }

    const repo = Repository.openConnection();

    const userId = await repo.sessions().getUserIdBySessionId(sessionId);
    if (userId === null) {
      return unauthrorized();
    }

    await repo.users().updateHasAvatar(userId, true);

    const image = await request.arrayBuffer();
    await MEDIA_BUCKET.put(`user/${userId}`, image);

    return new Response();
  }
);
