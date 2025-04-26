import { putRawImage } from '@/api/media/putRawImage';
import { badRequest } from '@/api/responses';
import { Repository } from '@/data/repo';
import { parseHtmlToRichText } from '@/richText/parser';
import { creatMediaServerParseContext } from '@/richText/parserContext';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const image = formData.get('image');
  const description = formData.get('description');

  if (!(image instanceof File && typeof description === 'string')) {
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
    .insert({ date: new Date(), title: '', description: richTextDescription });

  await putRawImage(`events/${id.insertedId}`, imageBuffer);

  return new NextResponse();
}
