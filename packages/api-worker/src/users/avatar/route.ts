import { putMediaFile } from '@shared/api/media';
import { unauthrorized } from '@shared/responses';
import { getSessionIdNumber } from '@shared/api/auth';
import { Repository } from '@data/repo';
import { app } from '@/app';

app.post('/users/avatar', async (request: Request) => {
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
    await putMediaFile(`user/${userId}`, image);

    return new Response();
  });
});
