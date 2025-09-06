import { Repository, UserRole } from '@sc-fam/data';
import { notFound, ok } from '@sc-fam/shared';
import { int, middlewareHandler, params } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';
import { resolveImageData } from '@/api/media/imageData';
import { putMultipleSizedImages } from '@/api/media/multiple';
import { MediaTransaction } from '@/api/media/transaction';
import { hydrateRichText } from '@/api/richText/hydration';

import { parseEditGuidePayload } from '../payloads';

app.put(
  '/guides/:id',
  middlewareHandler(
    params({ id: int(notFound) }),
    auth({ minRole: UserRole.ADMIN }),
    async ({ request, env, data: [{ id }] }) => {
      const formData = await request.formData();
      const { title, slug, description, descriptionFiles, image } =
        parseEditGuidePayload(formData);

      const imageBuffer = await image?.bytes();
      const imageData = imageBuffer && resolveImageData(imageBuffer);

      // Use media and repo transactions here to ensure consistency if an error happens somewhere.
      await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

      const repo = Repository.openConnection();
      const prevDescription = await repo.guides().getDescriptionById(id);
      if (prevDescription === null) {
        return notFound();
      }

      const hydratedDescription = await hydrateRichText(description, {
        env,
        mediaTransaction,
        files: descriptionFiles,
        previous: prevDescription,
      });

      await repo.guides().update(id, {
        title,
        slug,
        description: hydratedDescription,
        updatedAtDate: Date.now(),
        images: imageData,
      });

      if (imageBuffer && imageData) {
        await putMultipleSizedImages(
          env,
          `guides/${id}`,
          imageBuffer,
          imageData,
          mediaTransaction
        );
      }

      await mediaTransaction.commit();

      return new Response();
    }
  )
);

app.delete(
  '/guides/:id',
  middlewareHandler(
    params({ id: int(ok) }),
    auth({ minRole: UserRole.ADMIN }),
    async ({ env: { MEDIA_BUCKET }, data: [{ id }] }) => {
      const repo = Repository.openConnection();
      const { changes } = await repo.guides().deleteWhere({ id }).get();

      if (changes !== 0) {
        await MEDIA_BUCKET.delete(`guides/${id}`);
      }

      return new Response();
    }
  )
);
