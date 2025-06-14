import { parseEditEventPayload } from '@shared/api/events/payloads';
import { MediaTransaction } from '@/api/media/transaction';
import { parseHtmlToRichText } from '@shared/richText/parser';
import { getImageSize } from '@shared/image/size';
import { authRoute } from '@/api/authRoute';
import { UserRole } from '@shared/api/user/types';
import { app } from '@/api/app';
import { Repository } from '@data/repo';
import { notFound, ok } from '@shared/responses';
import { Event } from '@shared/api/events/types';
import { richTextToHtml } from '@shared/richText/htmlBuilder';
import { creatMediaServerParseContext } from '@/api/media/richText';
import { resolveImageSizes } from '@shared/image/breakpoints';
import { putMultipleSizedImages } from '@/api/media/multiple';

app.get('/events/:id', async (_request, { params: { id } }) => {
  await using repo = await Repository.openConnection();
  const event = await repo.events().findById(id);

  if (event === null) {
    return notFound();
  }

  const responseData: Event = {
    id,
    status: event.status,
    title: event.title,
    date: event.date.toISOString(),
    description: richTextToHtml(event.description, {
      mediaUrl: import.meta.env.VITE_MEDIA_URL,
    }),
  };

  return ok(responseData);
});

app.put('/events/:id', async (request, { env, params: { id } }) => {
  const formData = await request.formData();
  const { title, description, date, image, status } =
    parseEditEventPayload(formData);

  const imageBuffer = await image?.bytes();
  const imageSize = imageBuffer ? getImageSize(imageBuffer) : undefined;

  // Use media and repo transactions here to ensure consistency if an error happens somewhere.
  await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

  const richTextDescription = await parseHtmlToRichText(
    description,
    creatMediaServerParseContext(mediaTransaction)
  );

  return await authRoute(request, UserRole.ADMIN, async (repo) => {
    await repo.transaction(async (trepo) => {
      const sizes = imageSize && resolveImageSizes(imageSize);

      const result = await trepo.events().update(id, {
        date,
        title,
        status,
        description: richTextDescription,
        images: sizes,
      });

      if (result.matchedCount === 0) {
        throw new Error("Specified event doesn't exist");
      }

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
