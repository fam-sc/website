import { Repository, UserRole } from '@sc-fam/data';
import { ok } from '@sc-fam/shared';
import { getImageSize, resolveImageSizes } from '@sc-fam/shared/image';
import { enumValidator } from '@sc-fam/shared/minivalidate';
import { middlewareHandler, searchParams } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { parseAddEventPayload } from '@/api/events/payloads';
import { MediaTransaction } from '@/api/media/transaction';

import { auth } from '../authRoute';
import { putMultipleSizedImages } from '../media/multiple';
import { hydrateRichText } from '../richText/hydration';

app.get(
  '/events',
  middlewareHandler(
    searchParams({ type: enumValidator(['short']) }),
    async () => {
      const repo = Repository.openConnection();
      const result = await repo.events().getAllShortEvents();

      return ok(result);
    }
  )
);

app.post(
  '/events',
  middlewareHandler(
    auth({ minRole: UserRole.ADMIN }),
    async ({ request, env }) => {
      const formData = await request.formData();
      const { description, descriptionFiles, date, image, ...restPayload } =
        parseAddEventPayload(formData);

      // Use media and repo transactions here to ensure consistency if an error happens somewhere.
      await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

      const richTextDescription = await hydrateRichText(description, {
        env,
        mediaTransaction,
        files: descriptionFiles,
      });

      const imageBuffer = await image.bytes();
      const sizes = resolveImageSizes(getImageSize(imageBuffer));

      const repo = Repository.openConnection();
      const id = await repo.events().insertEvent({
        date: date.getTime(),
        description: richTextDescription,
        images: sizes,
        ...restPayload,
      });

      await putMultipleSizedImages(
        env,
        `events/${id}`,
        imageBuffer,
        sizes,
        mediaTransaction
      );

      await mediaTransaction.commit();

      return new Response();
    }
  )
);
