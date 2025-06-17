import { parseEditEventPayload } from '@/api/events/payloads';
import { MediaTransaction } from '@/api/media/transaction';
import { getImageSize } from '@shared/image/size';
import { authRoute } from '@/api/authRoute';
import { app } from '@/api/app';
import { notFound } from '@shared/responses';
import { resolveImageSizes } from '@shared/image/breakpoints';
import { putMultipleSizedImages } from '@/api/media/multiple';
import { hydrateRichText } from '@/api/richText/hydration';
import { Event } from '@data/types';
import { UserRole } from '@data/types/user';

app.put('/events/:id', async (request, { env, params: { id } }) => {
  const formData = await request.formData();
  const { title, description, descriptionFiles, date, image, status } =
    parseEditEventPayload(formData);

  const imageBuffer = await image?.bytes();
  const imageSize = imageBuffer ? getImageSize(imageBuffer) : undefined;

  // Use media and repo transactions here to ensure consistency if an error happens somewhere.
  await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

  return await authRoute(request, UserRole.ADMIN, async (repo) => {
    await repo.transaction(async (trepo) => {
      const sizes = imageSize && resolveImageSizes(imageSize);

      const prevDescription = await trepo.events().getDescriptionById(id);
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
        date,
        title,
        status,
        description: hydratedDescription,
      };

      if (sizes) {
        newEvent.images = sizes;
      }

      await trepo.events().update(id, newEvent);

      if (imageBuffer && sizes) {
        await putMultipleSizedImages(
          env,
          `events/${id}`,
          imageBuffer,
          sizes,
          mediaTransaction
        );
      }
    });

    await mediaTransaction.commit();

    return new Response();
  });
});

app.delete(
  '/events/:id',
  async (request, { env: { MEDIA_BUCKET }, params: { id } }) => {
    return authRoute(request, UserRole.ADMIN, async (repo) => {
      const result = await repo.events().delete(id);
      if (result.deletedCount !== 0) {
        await MEDIA_BUCKET.delete(`events/${id}`);
      }

      return new Response();
    });
  }
);
