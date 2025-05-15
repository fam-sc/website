import { PageProps } from '@/types/next';
import { Repository } from '@data/repo';
import { notFound } from 'next/navigation';
import { ClientComponent } from './client';

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  await using repo = await Repository.openConnection();

  const poll = await repo.polls().findById(id);
  if (poll === null) {
    notFound();
  }

  return (
    <ClientComponent
      poll={{ id, title: poll.title, questions: poll.questions }}
    />
  );
}
