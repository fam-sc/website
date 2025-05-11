import { Repository } from '@data/repo';
import { ClientComponent } from './client';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types/next';
import { omitProperty } from '@/utils/object/omit';

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
        ...omitProperty(event, '_id'),
        id: event._id.toString(),
      }}
      canEdit
    />
  );
}
