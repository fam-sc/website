import { Repository, UserRole } from '@sc-fam/data';
import { getImageSize, resolveImageSizes } from '@sc-fam/shared/image';
import { formData, middlewareHandler } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { MediaTransaction } from '@/api/media/transaction';

import { auth } from '../authRoute';
import { putMultipleSizedImages } from '../media/multiple';
import { hydrateRichText } from '../richText/hydration';
import { parseAddGuidePayload } from './payloads';

app.post(
  '/guides',
  middlewareHandler(
    formData(parseAddGuidePayload),
    async ({ env, data: [{ image, description, descriptionFiles }] }) => {
      // Use media and repo transactions here to ensure consistency if an error happens somewhere.
      await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

      const richTextDescription = await hydrateRichText(description, {
        env,
        mediaTransaction,
        files: descriptionFiles,
      });

      const imageBuffer = await image?.bytes();
      const sizes = imageBuffer
        ? resolveImageSizes(getImageSize(imageBuffer))
        : null;

      return { richTextDescription, sizes, imageBuffer };
    },
    auth({ minRole: UserRole.ADMIN }),
    async ({
      env,
      data: [{ title, slug }, { richTextDescription, sizes, imageBuffer }],
    }) => {
      const now = Date.now();

      const repo = Repository.openConnection();
      const id = await repo.guides().insertGuide({
        title,
        slug,
        description: richTextDescription,
        createdAtDate: now,
        updatedAtDate: now,
        images: sizes,
      });

      // Use media and repo transactions here to ensure consistency if an error happens somewhere.
      await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

      if (imageBuffer && sizes) {
        await putMultipleSizedImages(
          env,
          `guides/${id}`,
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
