import { Repository, UserRole } from '@sc-fam/data';
import { notFound, ok } from '@sc-fam/shared';
import { formatDateTime } from '@sc-fam/shared/chrono';
import { int, middlewareHandler, params } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';

import { GalleryImageWithEvent } from '../types';

app.get(
  '/gallery/:id',
  middlewareHandler(
    params({ id: int(notFound) }),
    async ({ data: [{ id }] }) => {
      const repo = Repository.openConnection();
      const image = await repo.galleryImages().getGalleryImageWithEvent(id);

      if (image === null) {
        return notFound();
      }

      return ok<GalleryImageWithEvent>({
        id: image.id,
        date: formatDateTime(new Date(image.date)),
        event: image.event,
      });
    }
  )
);

app.delete(
  '/gallery/:id',
  middlewareHandler(
    params({ id: int(ok) }),
    auth({ minRole: UserRole.ADMIN }),
    async ({ env: { MEDIA_BUCKET }, data: [{ id }] }) => {
      const repo = Repository.openConnection();
      const result = await repo.galleryImages().deleteWhere({ id }).get();

      if (result.changes > 0) {
        await MEDIA_BUCKET.delete(`gallery/${id}`);
      }

      return new Response();
    }
  )
);
