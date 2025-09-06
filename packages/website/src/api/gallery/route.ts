import { Repository, UserRole } from '@sc-fam/data';
import { badRequest, ok, parseInt } from '@sc-fam/shared';
import { int } from '@sc-fam/shared/minivalidate';
import { middlewareHandler, searchParams } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { MediaTransaction } from '@/api/media/transaction';

import { auth } from '../authRoute';
import { resolveImageData } from '../media/imageData';
import { putMultipleSizedImages } from '../media/multiple';
import { GalleryImageWithSizes } from './types';

const PAGE_SIZE = 20;
const EVENT_NOT_EXIST_MESSAGE = "Specified event doesn't exist";

app.get(
  '/gallery',
  middlewareHandler(
    searchParams({ page: int() }),
    async ({ data: [{ page }] }) => {
      const repo = Repository.openConnection();
      const images = await repo.galleryImages().getPage(page - 1, PAGE_SIZE);

      return ok<GalleryImageWithSizes[]>(
        images.map(({ id, images }) => ({ id, imageData: images }))
      );
    }
  )
);

app.post(
  '/gallery',
  middlewareHandler(
    async ({ request }) => {
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
        return badRequest({
          message: "Every item of 'files' should be a file",
        });
      }

      const filesWithSize = await Promise.all(
        files.map(async (file) => {
          const content = await file.bytes();

          return { content, imageData: resolveImageData(content) };
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

      return { eventObjectId, filesWithSize, date };
    },
    auth({ minRole: UserRole.ADMIN }),
    async ({ data: [{ eventObjectId, filesWithSize, date }], env }) => {
      const repo = Repository.openConnection();

      if (eventObjectId !== undefined) {
        const event = await repo.events().findOneWhere({ id: eventObjectId });

        if (event === null) {
          return badRequest({ message: EVENT_NOT_EXIST_MESSAGE });
        }
      }

      const insertedIds = await repo.galleryImages().insertMany(
        filesWithSize.map(({ imageData }, i) => ({
          eventId: eventObjectId ?? null,
          date,
          order: i,
          images: JSON.stringify(imageData),
        })),
        'id'
      );

      await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);

      await Promise.all(
        filesWithSize.map(({ content, imageData }, i) => {
          const id = insertedIds[i];

          return putMultipleSizedImages(
            env,
            `gallery/${id}`,
            content,
            imageData,
            mediaTransaction
          );
        })
      );

      await mediaTransaction.commit();

      return new Response();
    }
  )
);
