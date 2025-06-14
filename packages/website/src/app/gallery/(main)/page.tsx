import { ClientComponent } from './client';
import { Route } from './+types/page';
import { Repository } from '@data/repo';

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  await using repo = await Repository.openConnection();
  const sizes =
    id !== null ? await repo.galleryImages().getImageSizes(id) : null;

  return id !== null && sizes !== null ? { id, sizes } : null;
}

export default function Page({ loaderData: image }: Route.ComponentProps) {
  return <ClientComponent selected={image} />;
}
