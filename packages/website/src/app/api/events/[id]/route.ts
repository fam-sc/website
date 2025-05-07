import { parseEditEventPayload } from '@/api/events/payloads';
import { deleteMediaFile } from '@/api/media';
import { MediaTransaction } from '@/api/media/transaction';
import { Repository } from '@data/repo';
import { parseHtmlToRichText } from '@shared/richText/parser';
import { creatMediaServerParseContext } from '@/api/media/richText';
import { BSONError } from 'bson';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  const { id } = await params;

  const formData = await request.formData();
  const { title, description, date, image } = parseEditEventPayload(formData);

  // Use media and repo transactions here to ensure consistency if an error happens somewhere.
  await using mediaTransaction = new MediaTransaction();

  const richTextDescription = await parseHtmlToRichText(
    description,
    creatMediaServerParseContext(mediaTransaction)
  );

  await using repo = await Repository.openConnection();

  await repo.transaction(async (trepo) => {
    const result = await trepo
      .events()
      .update(id, { date, title, description: richTextDescription });

    if (result.matchedCount === 0) {
      throw new Error("Specified event doesn't exist");
    }

    if (image !== undefined) {
      mediaTransaction.put(`events/${id}`, image.stream());
    }
  });

  await mediaTransaction.commit();

  return new NextResponse();
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  const { id } = await params;
  await using repo = await Repository.openConnection();

  let objectId: ObjectId;

  try {
    objectId = new ObjectId(id);
  } catch (error: unknown) {
    if (BSONError.isBSONError(error)) {
      // Return 200 - the client expects the event to be deleted, it's already deleted because it would never exist (invalid id format).
      return new NextResponse();
    }

    console.error(error);
    return new NextResponse(null, { status: 500 });
  }

  const event = await repo.events().findById(new ObjectId(id));
  if (event === null) {
    // Return 200 - the client expects the event to be deleted, it's already deleted.
    return new NextResponse();
  }

  await Promise.all([
    repo.events().delete(objectId),
    deleteMediaFile(`events/${event._id}`),
  ]);

  return new NextResponse();
}
