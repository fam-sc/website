import { GalleryImageWithEvent } from '@/api/gallery/types';
import { notFound, ok } from '@shared/responses';
import { Repository } from '@data/repo';
import { formatDateTime } from '@shared/date';
import { ObjectId } from 'mongodb';
import { authRoute } from '@/api/authRoute';
import { UserRole } from '@data/types/user';
import { app } from '@/api/app';

app.get('/gallery/:id', async (_request, { params: { id } }) => {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return notFound();
  }

  await using repo = await Repository.openConnection();
  const image = await repo.galleryImages().getGalleryImageWithEvent(objectId);
  if (image === null) {
    return notFound();
  }

  const { event } = image;

  const result: GalleryImageWithEvent = {
    id: image._id.toString(),
    date: formatDateTime(image.date),
    event: event ? { id: event._id.toString(), title: event.title } : null,
  };

  return ok(result);
});

app.delete(
  '/gallery/:id',
  async (request, { env: { MEDIA_BUCKET }, params: { id } }) => {
    return authRoute(request, UserRole.ADMIN, async (repo) => {
      const result = await repo.galleryImages().delete(id);

      if (result.deletedCount > 0) {
        await MEDIA_BUCKET.delete(`gallery/${id}`);
      }

      return new Response();
    });
  }
);
