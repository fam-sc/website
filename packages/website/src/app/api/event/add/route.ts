import { putMediaFile } from '@/api/media';
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

  const richTextDescription = await parseHtmlToRichText(
    description,
    creatMediaServerParseContext()
  );

  await using repo = await Repository.openConnection();
  const { insertedId } = await repo
    .events()
    .insert({ date, title, description: richTextDescription });

  await putMediaFile(`events/${insertedId}`, image.stream());

  return new NextResponse();
}
