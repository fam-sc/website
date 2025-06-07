import { GalleryImageWithEvent } from '@shared/api/gallery/types';
import { deleteMediaFile } from '@shared/api/media';
import { notFound, ok } from '@shared/responses';
import { Repository } from '@data/repo';
import { formatDateTime } from '@shared/date';
import { ObjectId } from 'mongodb';
import { authRoute } from '@/authRoute';
import { UserRole } from '@shared/api/user/types';
import { app } from '@/app';

app.get('/gallery', async (_request, { params: { id } }) => {
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

app.delete('/gallery', async (request, { params: { id } }) => {
  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const result = await repo.galleryImages().delete(id);

    if (result.deletedCount > 0) {
      // Unability to delete image from R2 should not an obstacle for deleting an image.
      deleteMediaFile(`gallery/${id}`).catch((error: unknown) => {
        console.error(error);
      });
    }

    return new Response();
  });
});
