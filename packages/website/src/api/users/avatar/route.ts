import { Repository } from '@sc-fam/data';
import { unauthorized } from '@sc-fam/shared';
import { getImageMimeType } from '@sc-fam/shared/image';

import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';

app.post(
  '/users/avatar',
  async (request: Request, { env: { MEDIA_BUCKET } }) => {
    const sessionId = getSessionId(request);
    if (sessionId === undefined) {
      return unauthorized();
    }

    const repo = Repository.openConnection();

    const userId = await repo.sessions().getUserIdBySessionId(sessionId);
    if (userId === null) {
      return unauthorized();
    }

    await repo.users().updateHasAvatar(userId, true);

    const image = await request.bytes();
    const imageMimeType = getImageMimeType(image);

    await MEDIA_BUCKET.put(`user/${userId}`, image, {
      httpMetadata: { contentType: imageMimeType },
    });

    return new Response();
  }
);
