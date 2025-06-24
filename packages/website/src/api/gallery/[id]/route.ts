import { notFound, ok } from '@shared/responses';
import { Repository } from '@data/repo';
import { formatDateTime } from '@shared/date';
import { authRoute } from '@/api/authRoute';
import { UserRole } from '@data/types/user';
import { app } from '@/api/app';
import { parseInt } from '@shared/parseInt';
import { GalleryImageWithEvent } from '../types';

app.get('/gallery/:id', async (_request, { params: { id } }) => {
  const numberId = parseInt(id);
  if (numberId === undefined) {
    return notFound();
  }

  const repo = Repository.openConnection();
  const image = await repo.galleryImages().getGalleryImageWithEvent(numberId);
  if (image === null) {
    return notFound();
  }

  const result: GalleryImageWithEvent = {
    id: image.id,
    date: formatDateTime(new Date(image.date)),
    event: image.event,
  };

  return ok(result);
});

app.delete(
  '/gallery/:id',
  async (request, { env: { MEDIA_BUCKET }, params: { id } }) => {
    const numberId = parseInt(id);
    if (numberId === undefined) {
      return new Response();
    }

    return authRoute(request, UserRole.ADMIN, async (repo) => {
      const result = await repo
        .galleryImages()
        .deleteWhere({ id: numberId })
        .get();

      if (result.changes > 0) {
        await MEDIA_BUCKET.delete(`gallery/${id}`);
      }

      return new Response();
    });
  }
);
