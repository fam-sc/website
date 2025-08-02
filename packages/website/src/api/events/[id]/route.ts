import { Repository, UserRole } from '@sc-fam/data';
import { notFound, ok } from '@sc-fam/shared';
import { getImageSize, resolveImageSizes } from '@sc-fam/shared/image';
import { int, middlewareHandler, params } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';
import { parseEditEventPayload } from '@/api/events/payloads';
import { putMultipleSizedImages } from '@/api/media/multiple';
import { MediaTransaction } from '@/api/media/transaction';
import { hydrateRichText } from '@/api/richText/hydration';

app.put(
  '/events/:id',
  middlewareHandler(
    params({ id: int(notFound) }),
    auth({ minRole: UserRole.ADMIN }),
    async ({ request, env, data: [{ id }] }) => {
      const formData = await request.formData();
      const { description, descriptionFiles, date, image, ...restPayload } =
        parseEditEventPayload(formData);

      const imageBuffer = await image?.bytes();
      const imageSize = imageBuffer && getImageSize(imageBuffer);
      const sizes = imageSize && resolveImageSizes(imageSize);

      // Use media and repo transactions here to ensure consistency if an error happens somewhere.
      await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

      const repo = Repository.openConnection();
      const prevDescription = await repo.events().getDescriptionById(id);
      if (prevDescription === null) {
        return notFound();
      }

      const hydratedDescription = await hydrateRichText(description, {
        env,
        mediaTransaction,
        files: descriptionFiles,
        previous: prevDescription,
      });

      await repo.events().update(id, {
        date: date.getTime(),
        description: hydratedDescription,
        images: sizes,
        ...restPayload,
      });

      if (imageBuffer && sizes) {
        await putMultipleSizedImages(
          env,
          `events/${id}`,
          imageBuffer,
          sizes,
          mediaTransaction
        );
      }

      await mediaTransaction.commit();

      return new Response();
    }
  )
);

app.delete(
  '/events/:id',
  middlewareHandler(
    params({ id: int(ok) }),
    auth({ minRole: UserRole.ADMIN }),
    async ({ env: { MEDIA_BUCKET }, data: [{ id }] }) => {
      const repo = Repository.openConnection();
      const { changes } = await repo.events().deleteWhere({ id }).get();

      if (changes !== 0) {
        await MEDIA_BUCKET.delete(`events/${id}`);
      }

      return new Response();
    }
  )
);
