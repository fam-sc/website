import { UserRole } from '@sc-fam/data';
import { getImageSize, resolveImageSizes } from '@sc-fam/shared/image';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';
import { MediaTransaction } from '@/api/media/transaction';

import { putMultipleSizedImages } from '../media/multiple';
import { hydrateRichText } from '../richText/hydration';
import { parseAddGuidePayload } from './payloads';

app.post('/guides', async (request, { env }) => {
  const formData = await request.formData();
  const { title, slug, description, descriptionFiles, image } =
    parseAddGuidePayload(formData);

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

  return await authRoute(request, UserRole.ADMIN, async (repo) => {
    const now = Date.now();
    const id = await repo.guides().insertGuide({
      title,
      slug,
      description: richTextDescription,
      createdAtDate: now,
      updatedAtDate: now,
      images: sizes,
    });

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
  });
});
