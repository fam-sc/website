import { ClientComponent } from './client';
import { omitProperty } from '@/utils/object/omit';
import { notFound } from '@shared/responses';
import { Route } from './+types/page';
import { Repository } from '@data/repo';

export async function loader({ params }: Route.LoaderArgs) {
  await using repo = await Repository.openConnection();
  const event = await repo.events().findById(params.id);

  if (event === null) {
    return notFound();
  }

  return {
    event: {
      ...omitProperty(event, '_id'),
      id: event._id.toString(),
    },
  };
}

export default function Page({ loaderData: { event } }: Route.ComponentProps) {
  return <ClientComponent event={event} />;
}
