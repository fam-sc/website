import { GalleryImageWithEvent } from '@/api/gallery/types';
import { deleteMediaFile } from '@/api/media';
import { notFound, ok } from '@/api/responses';
import { Repository } from '@data/repo';
import { formatDateTime } from '@/utils/date';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  const { id } = await params;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return notFound();
  }

  await using repo = await Repository.openConnection();
  const image = await repo.galleryImages().getGalleryImageWithEvent(objectId);
  if (image === null) {
    return notFound();
  }

  const { event } = image;

  const result: GalleryImageWithEvent = {
    id: image._id.toString(),
    date: formatDateTime(image.date),
    event: event ? { id: event._id.toString(), title: event.title } : null,
  };

  return ok(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  const { id } = await params;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return new NextResponse();
  }

  await using repo = await Repository.openConnection();
  const result = await repo.galleryImages().delete(objectId);

  if (result.deletedCount > 0) {
    // Unability to delete image from R2 should not an obstacle for deleting an image.
    deleteMediaFile(`gallery/${id}`).catch((error: unknown) => {
      console.error(error);
    });
  }

  return new NextResponse();
}
