import { Repository } from '@sc-fam/data';
import { getImageMimeType } from '@sc-fam/shared/image';
import { middlewareHandler } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';

app.post(
  '/users/avatar',
  middlewareHandler(
    auth(),
    async ({ request, data: [{ id: userId }], env: { MEDIA_BUCKET } }) => {
      const repo = Repository.openConnection();

      await repo.users().updateHasAvatar(userId, true);

      const image = await request.bytes();
      const imageMimeType = getImageMimeType(image);

      await MEDIA_BUCKET.put(`user/${userId}`, image, {
        httpMetadata: { contentType: imageMimeType },
      });

      return new Response();
    }
  )
);
