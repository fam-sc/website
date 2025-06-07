import { PageProps } from '@/types/next';
import { ClientComponent } from './client';
import { Repository } from '@data/repo';
import { notFound } from 'next/navigation';
import { formatDateTime } from '@shared/date';
import { Metadata } from 'next';
import { cache } from 'react';

type PollPageProps = PageProps<{ id: string }>;

const getPoll = cache(async (id: string) => {
  await using repo = await Repository.openConnection();

  return await repo.polls().findShortPoll(id);
});

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
    openGraph: {
      title,
    },
  };
}

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const poll = await getPoll(id);

  if (poll === null) {
    notFound();
  }

  return (
    <ClientComponent
      poll={{
        id,
        title: poll.title,
        startDate: formatDateTime(poll.startDate),
        endDate: poll.endDate ? formatDateTime(poll.endDate) : null,
      }}
    />
  );
}
