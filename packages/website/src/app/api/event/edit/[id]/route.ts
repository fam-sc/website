import { parseEditEventPayload } from '@/api/events/payloads';
import { MediaTransaction } from '@/api/media/transaction';
import { Repository } from '@/data/repo';
import { parseHtmlToRichText } from '@/richText/parser';
import { creatMediaServerParseContext } from '@/richText/parserContext';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
