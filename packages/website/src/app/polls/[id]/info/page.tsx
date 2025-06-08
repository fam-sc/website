import { ClientComponent } from './client';
import { Repository } from '@data/repo';
import { formatDateTime } from '@shared/date';
import { cache } from 'react';
import { notFound } from '@shared/responses';
import { Route } from './+types/page';
import { omitProperty } from '@/utils/object/omit';

const getPoll = cache(async (id: string) => {
  await using repo = await Repository.openConnection();

  return await repo.polls().findShortPoll(id);
});

// TODO: Fix it.
/*
export async function generateMetadata({
  params,
}: PollPageProps): Promise<Metadata> {
  const { id } = await params;
  const poll = await getPoll(id);

  if (poll === null) {
    return {};
  }

  const title = `${poll.title} | Інформація`;

  return {
    title,
  };
}
*/

export async function loader({ params }: Route.LoaderArgs) {
  const poll = await getPoll(params.id);

  if (poll === null) {
    return notFound();
  }

  return { poll: { id: poll._id.toString(), ...omitProperty(poll, '_id') } };
}

export default function Page({ loaderData: { poll } }: Route.ComponentProps) {
  return (
    <ClientComponent
      poll={{
        id: poll.id,
        title: poll.title,
        startDate: formatDateTime(poll.startDate),
        endDate: poll.endDate ? formatDateTime(poll.endDate) : null,
      }}
    />
  );
}
