import { Repository, UserRole } from '@sc-fam/data';
import { badRequest, ok } from '@sc-fam/shared';
import { getImageSize, resolveImageSizes } from '@sc-fam/shared/image';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';
import { parseAddEventPayload } from '@/api/events/payloads';
import { MediaTransaction } from '@/api/media/transaction';

import { putMultipleSizedImages } from '../media/multiple';
import { hydrateRichText } from '../richText/hydration';

app.get('/events', async (request) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type !== 'short') {
    return badRequest({ message: 'Invalid type' });
  }

  const repo = Repository.openConnection();
  const result = await repo.events().getAllShortEvents();

  return ok(result);
});

app.post('/events', async (request, { env }) => {
  const formData = await request.formData();
  const { title, description, descriptionFiles, date, image, status } =
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

  return await authRoute(request, UserRole.ADMIN, async (repo) => {
    const id = await repo.events().insertEvent({
      date: date.getTime(),
      status,
      title,
      description: richTextDescription,
      images: sizes,
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
  });
});
