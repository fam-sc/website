import { Repository } from '@data/repo';
import { ClientComponent } from './client';
import { omitProperty } from '@/utils/object/omit';
import { cache } from 'react';
import { notFound } from '@shared/responses';
import { Route } from './+types/page';

const getEvent = cache(async (id: string) => {
  await using repo = await Repository.openConnection();

  return await repo.events().findById(id);
});

export async function loader({ params }: Route.LoaderArgs) {
  const event = await getEvent(params.id);

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
