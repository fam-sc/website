import { Event, UserRole } from '@sc-fam/data';
import { notFound, parseInt } from '@sc-fam/shared';
import { getImageSize, resolveImageSizes } from '@sc-fam/shared/image';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';
import { parseEditEventPayload } from '@/api/events/payloads';
import { putMultipleSizedImages } from '@/api/media/multiple';
import { MediaTransaction } from '@/api/media/transaction';
import { hydrateRichText } from '@/api/richText/hydration';

app.put('/events/:id', async (request, { env, params: { id } }) => {
  const numberId = parseInt(id);
  if (numberId === undefined) {
    return notFound();
  }

  const formData = await request.formData();
  const { description, descriptionFiles, date, image, ...restPayload } =
    parseEditEventPayload(formData);

  const imageBuffer = await image?.bytes();
  const imageSize = imageBuffer ? getImageSize(imageBuffer) : undefined;

  // Use media and repo transactions here to ensure consistency if an error happens somewhere.
  await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

  return await authRoute(request, UserRole.ADMIN, async (repo) => {
    const sizes = imageSize && resolveImageSizes(imageSize);

    const prevDescription = await repo.events().getDescriptionById(numberId);
    if (prevDescription === null) {
      return notFound();
    }

    const hydratedDescription = await hydrateRichText(description, {
      env,
      mediaTransaction,
      files: descriptionFiles,
      previous: prevDescription,
    });

    const newEvent: Partial<Event> = {
      date: date.getTime(),
      description: hydratedDescription,
      ...restPayload,
    };

    if (sizes) {
      newEvent.images = sizes;
    }

    await repo.events().update(numberId, newEvent);

    if (imageBuffer && sizes) {
      await putMultipleSizedImages(
        env,
        `events/${numberId}`,
        imageBuffer,
        sizes,
        mediaTransaction
      );
    }

    await mediaTransaction.commit();

    return new Response();
  });
});

app.delete(
  '/events/:id',
  async (request, { env: { MEDIA_BUCKET }, params: { id } }) => {
    const numberId = parseInt(id);
    if (numberId === undefined) {
      return new Response();
    }

    return authRoute(request, UserRole.ADMIN, async (repo) => {
      const { changes } = await repo
        .events()
        .deleteWhere({ id: numberId })
        .get();

      if (changes !== 0) {
        await MEDIA_BUCKET.delete(`events/${id}`);
      }

      return new Response();
    });
  }
);
