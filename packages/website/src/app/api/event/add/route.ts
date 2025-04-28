import { putRawImage } from '@/api/media/putRawImage';
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

  const imageBuffer = image.stream();
  const richTextDescription = await parseHtmlToRichText(
    description,
    creatMediaServerParseContext()
  );

  await using repo = await Repository.openConnection();
  const id = await repo
    .events()
    .insert({ date, title, description: richTextDescription });

  await putRawImage(`events/${id.insertedId}`, imageBuffer);

  return new NextResponse();
}
