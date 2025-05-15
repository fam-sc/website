import { PageProps } from '@/types/next';
import { ClientComponent } from './client';
import { GalleryImageWithSize } from '@/api/gallery/types';
import { Repository } from '@data/repo';

async function getGalleryImageWithSize(
  id: string
): Promise<GalleryImageWithSize | null> {
  await using repo = await Repository.openConnection();
  const size = await repo.galleryImages().getImageSize(id);

  return size && { id, ...size };
}

export default async function Page({ searchParams }: PageProps) {
  const { id: rawId } = await searchParams;
  const image =
    typeof rawId === 'string' ? await getGalleryImageWithSize(rawId) : null;

  return <ClientComponent selected={image} />;
}
