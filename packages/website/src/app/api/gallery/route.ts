import { MediaTransaction } from '@/api/media/transaction';
import { badRequest, ok } from '@/api/responses';
import { Repository } from '@data/repo';
import { BSONError } from 'bson';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;
const EVENT_NOT_EXIST_MESSAGE = "Specified event doesn't exist";

function parsePage(url: URL): number | null {
  const rawPage = url.searchParams.get('page');
  if (rawPage === null) {
    return 1;
  }

  const result = Number.parseInt(rawPage);
  if (Number.isNaN(result)) {
    return null;
  }

  return result;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const page = parsePage(url);
  if (page === null) {
    return badRequest({ message: 'Invalid page format' });
  }

  await using repo = await Repository.openConnection();
  const images = await repo.galleryImages().getPage(page - 1, PAGE_SIZE);

  return ok(images);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
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

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return badRequest({ message: 'Invalid date format' });
  }

  await using repo = await Repository.openConnection();

  let eventObjectId: ObjectId | undefined;

  try {
    if (eventId !== null) {
      eventObjectId = new ObjectId(eventId);
    }
  } catch (error: unknown) {
    if (BSONError.isBSONError(error)) {
      return badRequest({ message: 'Invalid event ID' });
    }

    throw error;
  }

  const insertResult = await repo.transaction(async (trepo) => {
    if (eventObjectId !== undefined) {
      const event = await repo.events().findById(eventObjectId);

      if (event === null) {
        return;
      }
    }

    return await trepo
      .galleryImages()
      .insertMany(files.map((_, i) => ({ eventId, date, order: i })));
  });

  if (!insertResult) {
    return badRequest({ message: EVENT_NOT_EXIST_MESSAGE });
  }

  await using mediaTransaction = new MediaTransaction();

  const { insertedIds } = insertResult;

  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < files.length; i++) {
    const id = insertedIds[i];

    mediaTransaction.put(`gallery/${id}`, files[i]);
  }

  await mediaTransaction.commit();

  return new NextResponse();
}
