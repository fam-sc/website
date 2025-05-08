import { Repository } from '@data/repo';
import { ClientComponent, ClientEvent } from './client';
import { richTextToHtml } from '@shared/richText/htmlBuilder';
import { PageProps } from '@/types/next';
import { redirect } from 'next/navigation';

async function getClientEvent(id: string): Promise<ClientEvent | undefined> {
  try {
    await using repo = await Repository.openConnection();
    const editEvent = await repo.events().findById(id);

    return editEvent
      ? {
          id,
          title: editEvent.title,
          date: editEvent.date,
          description: richTextToHtml(editEvent.description),
        }
      : undefined;
  } catch {
    return undefined;
  }
}

export default async function Page({ searchParams }: PageProps) {
  const { edit: editEventId } = await searchParams;
  const event =
    typeof editEventId === 'string'
      ? await getClientEvent(editEventId)
      : undefined;

  if (event === undefined && typeof editEventId === 'string') {
    redirect('/events/+');
  }

  return <ClientComponent event={event} />;
}
