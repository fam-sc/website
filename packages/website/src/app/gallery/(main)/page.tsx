import { PageProps } from '@/types/next';
import { ClientComponent } from './client';
import { GalleryImageWithSize } from '@/api/gallery/types';
import { Repository } from '@data/repo';
import { Metadata } from 'next';
import { cache } from 'react';
import { getMediaFileUrl } from '@shared/media';

const getGalleryImage = cache(
  async (id: string): Promise<GalleryImageWithSize | null> => {
    await using repo = await Repository.openConnection();
    const size = await repo.galleryImages().getImageSize(id);

    return size && { id, ...size };
  }
);

async function getGalleryImageFromSearchParams(
  searchParams: PageProps['searchParams']
) {
  const { id: rawId } = await searchParams;

  return typeof rawId === 'string' ? await getGalleryImage(rawId) : null;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const image = await getGalleryImageFromSearchParams(searchParams);
  const title = 'Галерея';

  if (image === null) {
    return { title };
  }

  return {
    title,
    openGraph: {
      images: {
        url: getMediaFileUrl(`gallery/${image.id}`),
        width: image.width,
        height: image.height,
      },
    },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const image = await getGalleryImageFromSearchParams(searchParams);

  return <ClientComponent selected={image} />;
}
