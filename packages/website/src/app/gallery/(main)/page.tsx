import { ClientComponent } from './client';
import { GalleryImageWithSize } from '@shared/api/gallery/types';
import { Repository } from '@data/repo';
import { cache } from 'react';
import { Route } from './+types/page';

const getGalleryImage = cache(
  async (id: string): Promise<GalleryImageWithSize | null> => {
    await using repo = await Repository.openConnection();
    const size = await repo.galleryImages().getImageSize(id);

    return size && { id, ...size };
  }
);

/*
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

*/

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const image = id !== null ? await getGalleryImage(id) : null;

  return { image };
}

export default function Page({ loaderData: { image } }: Route.ComponentProps) {
  return <ClientComponent selected={image} />;
}
