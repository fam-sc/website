import { authRoute } from '@/api/authRoute';
import { MediaTransaction } from '@/api/media/transaction';
import { badRequest, ok } from '@shared/responses';
import { getImageSize } from '@shared/image/size';
import { Repository } from '@data/repo';
import { UserRole } from '@shared/api/user/types';
import { ObjectId } from 'mongodb';
import { parseInt } from '@shared/parseInt';
import { app } from '@/api/app';
import { resolveImageSizes } from '@shared/image/breakpoints';
import { putMultipleSizedImages } from '../media/multiple';

const PAGE_SIZE = 20;
const EVENT_NOT_EXIST_MESSAGE = "Specified event doesn't exist";

function parsePage(url: URL): number | undefined {
  const rawPage = url.searchParams.get('page');

  return rawPage !== null ? parseInt(rawPage) : 1;
}

app.get('/gallery', async (request) => {
  const url = new URL(request.url);
  const page = parsePage(url);
  if (page === undefined) {
    return badRequest({ message: 'Invalid page format' });
  }

  await using repo = await Repository.openConnection();
  const images = await repo.galleryImages().getPage(page - 1, PAGE_SIZE);

  return ok(images);
});

app.post('/gallery', async (request, { env }) => {
  const formData = await request.formData();

  const eventId = formData.get('eventId');
  const dateString = formData.get('date');
  const files = formData.getAll('files');

  if (
    !(eventId === null || typeof eventId === 'string') ||
    typeof dateString !== 'string'
  ) {
    return badRequest({ message: 'Invalid arguments' });
  }

  if (files.length === 0) {
    return badRequest({ message: 'No files' });
  }

  if (!files.every((file) => typeof file === 'object')) {
    return badRequest({ message: "Every item of 'files' should be a file" });
  }

  const filesWithSize = await Promise.all(
    files.map(async (file) => {
      const content = await file.bytes();

      return { content, sizes: resolveImageSizes(getImageSize(content)) };
    })
  );

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return badRequest({ message: 'Invalid date format' });
  }

  let eventObjectId: ObjectId | undefined;

  try {
    if (eventId !== null) {
      eventObjectId = new ObjectId(eventId);
    }
  } catch {
    return badRequest({ message: 'Invalid event ID' });
  }

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    return repo.transaction(async (trepo) => {
      if (eventObjectId !== undefined) {
        const event = await repo.events().findById(eventObjectId);

        if (event === null) {
          return badRequest({ message: EVENT_NOT_EXIST_MESSAGE });
        }
      }

      const { insertedIds } = await trepo.galleryImages().insertMany(
        filesWithSize.map(({ sizes }, i) => ({
          eventId,
          date,
          order: i,
          images: sizes,
        }))
      );

      await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

      await Promise.all(
        filesWithSize.map(({ content, sizes }, i) => {
          const id = insertedIds[i];

          return putMultipleSizedImages(
            env,
            `gallery/${id}`,
            content,
            sizes,
            mediaTransaction
          );
        })
      );

      await mediaTransaction.commit();

      return new Response();
    });
  });
});
