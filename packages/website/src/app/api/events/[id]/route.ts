import { parseEditEventPayload } from '@/api/events/payloads';
import { deleteMediaFile } from '@/api/media';
import { MediaTransaction } from '@/api/media/transaction';
import { parseHtmlToRichText } from '@shared/richText/parser';
import { creatMediaServerParseContext } from '@/api/media/richText';
import { NextRequest, NextResponse } from 'next/server';
import { getImageSize } from '@/image/size';
import { authRoute } from '@/api/authRoute';
import { UserRole } from '@data/types/user';

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  const { id } = await params;

  const formData = await request.formData();
  const { title, description, date, image, status } =
    parseEditEventPayload(formData);

  const imageBuffer = await image?.bytes();
  const imageSize = imageBuffer ? getImageSize(imageBuffer) : undefined;

  // Use media and repo transactions here to ensure consistency if an error happens somewhere.
  await using mediaTransaction = new MediaTransaction();

  const richTextDescription = await parseHtmlToRichText(
    description,
    creatMediaServerParseContext(mediaTransaction)
  );

  return await authRoute(request, UserRole.ADMIN, async (repo) => {
    await repo.transaction(async (trepo) => {
      const result = await trepo.events().update(id, {
        date,
        title,
        status,
        description: richTextDescription,
        image: imageSize,
      });

      if (result.matchedCount === 0) {
        throw new Error("Specified event doesn't exist");
      }

      if (image !== undefined) {
        mediaTransaction.put(`events/${id}`, image.stream());
      }
    });

    await mediaTransaction.commit();

    return new NextResponse();
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  const { id } = await params;

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const result = await repo.events().delete(id);
    if (result.deletedCount !== 0) {
      await deleteMediaFile(`events/${id}`);
    }

    return new NextResponse();
  });
}
