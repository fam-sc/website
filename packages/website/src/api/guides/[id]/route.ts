import { Guide, UserRole } from '@sc-fam/data';
import { notFound, parseInt } from '@sc-fam/shared';
import { getImageSize, resolveImageSizes } from '@sc-fam/shared/image';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';
import { putMultipleSizedImages } from '@/api/media/multiple';
import { MediaTransaction } from '@/api/media/transaction';
import { hydrateRichText } from '@/api/richText/hydration';

import { parseEditGuidePayload } from '../payloads';

app.put('/guides/:id', async (request, { env, params: { id } }) => {
  const numberId = parseInt(id);
  if (numberId === undefined) {
    return notFound();
  }

  const formData = await request.formData();
  const { title, slug, description, descriptionFiles, image } =
    parseEditGuidePayload(formData);

  const imageBuffer = await image?.bytes();
  const imageSize = imageBuffer ? getImageSize(imageBuffer) : undefined;

  // Use media and repo transactions here to ensure consistency if an error happens somewhere.
  await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

  return await authRoute(request, UserRole.ADMIN, async (repo) => {
    const sizes = imageSize && resolveImageSizes(imageSize);

    const prevDescription = await repo.guides().getDescriptionById(numberId);
    if (prevDescription === null) {
      return notFound();
    }

    const hydratedDescription = await hydrateRichText(description, {
      env,
      mediaTransaction,
      files: descriptionFiles,
      previous: prevDescription,
    });

    const newGuide: Partial<Guide> = {
      title,
      slug,
      description: hydratedDescription,
      updatedAtDate: Date.now(),
    };

    if (sizes) {
      newGuide.images = sizes;
    }

    await repo.guides().update(numberId, newGuide);

    if (imageBuffer && sizes) {
      await putMultipleSizedImages(
        env,
        `guides/${numberId}`,
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
  '/guides/:id',
  async (request, { env: { MEDIA_BUCKET }, params: { id } }) => {
    const numberId = parseInt(id);
    if (numberId === undefined) {
      return new Response();
    }

    return authRoute(request, UserRole.ADMIN, async (repo) => {
      const { changes } = await repo
        .guides()
        .deleteWhere({ id: numberId })
        .get();

      if (changes !== 0) {
        await MEDIA_BUCKET.delete(`guides/${id}`);
      }

      return new Response();
    });
  }
);
