import { authRoute } from '@/api/authRoute';
import { MediaTransaction } from '@/api/media/transaction';
import { badRequest, ok } from '@shared/responses';
import { getImageSize } from '@shared/image/size';
import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
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

  const repo = Repository.openConnection();
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

  const numberEventId = eventId !== null ? parseInt(eventId) : null;

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

  const date = Date.parse(dateString);
  if (Number.isNaN(date)) {
    return badRequest({ message: 'Invalid date format' });
  }

  let eventObjectId: number | undefined;

  if (eventId !== null) {
    eventObjectId = parseInt(eventId);
    if (eventObjectId === undefined) {
      return badRequest({ message: 'Invalid event ID' });
    }
  }

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    if (eventObjectId !== undefined) {
      const event = await repo.events().findOneWhere({ id: eventObjectId });

      if (event === null) {
        return badRequest({ message: EVENT_NOT_EXIST_MESSAGE });
      }
    }

    const insertedIds = await repo.galleryImages().insertMany(
      filesWithSize.map(({ sizes }, i) => ({
        eventId: numberEventId,
        date,
        order: i,
        images: JSON.stringify(sizes),
      })),
      'id'
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
