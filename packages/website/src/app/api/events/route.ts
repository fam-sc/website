import { parseAddEventPayload } from '@/api/events/payloads';
import { MediaTransaction } from '@/api/media/transaction';
import { badRequest, ok } from '@/api/responses';
import { Repository } from '@data/repo';
import { parseHtmlToRichText } from '@shared/richText/parser';
import { creatMediaServerParseContext } from '@/api/media/richText';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  if (type !== 'short') {
    return badRequest({ message: 'Invalid type' });
  }

  await using repo = await Repository.openConnection();

  const result = await repo
    .events()
    .getAll()
    .project<{ _id: ObjectId; title: string }>({ title: 1 })
    .map(({ _id, title }) => ({ id: _id.toString(), title }))
    .toArray();

  return ok(result);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const { title, description, date, image, status } =
    parseAddEventPayload(formData);

  // Use media and repo transactions here to ensure consistency if an error happens somewhere.
  await using mediaTransaction = new MediaTransaction();

  const richTextDescription = await parseHtmlToRichText(
    description,
    creatMediaServerParseContext(mediaTransaction)
  );

  await using repo = await Repository.openConnection();

  await repo.transaction(async (trepo) => {
    const { insertedId } = await trepo
      .events()
      .insert({ date, status, title, description: richTextDescription });

    mediaTransaction.put(`events/${insertedId}`, image.stream());
  });

  await mediaTransaction.commit();

  return new NextResponse();
}
