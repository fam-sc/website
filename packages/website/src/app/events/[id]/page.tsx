import { Repository } from '@data/repo';
import { ClientComponent } from './client';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/next';

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  await using repo = await Repository.openConnection();

  const event = await repo.events().findById(id);

  if (event === null) {
    notFound();
  }

  return (
    <ClientComponent
      event={{
        id: event._id.toString(),
        title: event.title,
        date: event.date,
        description: event.description,
      }}
      canEdit
    />
  );
}
