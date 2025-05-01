import { MediaTransaction } from '@/api/media/transaction';
import { badRequest } from '@/api/responses';
import { Repository } from '@/data/repo';
import { parseHtmlToRichText } from '@/richText/parser';
import { creatMediaServerParseContext } from '@/richText/parserContext';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const rawDate = formData.get('date');
  const image = formData.get('image');

  if (
    !(
      image instanceof File &&
      typeof description === 'string' &&
      typeof rawDate === 'string' &&
      typeof title === 'string'
    )
  ) {
    return badRequest();
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return badRequest();
  }

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
      .insert({ date, title, description: richTextDescription });

    mediaTransaction.put(`events/${insertedId}`, image.stream());
  });

  await mediaTransaction.commit();

  return new NextResponse();
}
