import { Repository } from '@/data/repo';
import { ClientComponent, ClientEvent } from './client';
import { ObjectId } from 'mongodb';
import { richTextToHtml } from '@/richText/htmlBuilder';
import { PageProps } from '@/types/next';

async function getClientEvent(id: string): Promise<ClientEvent | undefined> {
  await using repo = await Repository.openConnection();
  const editEvent = await repo.events().findById(new ObjectId(id));

  return editEvent
    ? {
        id,
        date: editEvent.date,
        description: richTextToHtml(editEvent.description),
      }
    : undefined;
}

export default async function Page({ searchParams }: PageProps) {
  const { edit: editEventId } = await searchParams;
  const event =
    typeof editEventId === 'string'
      ? await getClientEvent(editEventId)
      : undefined;

  return <ClientComponent event={event} />;
}
