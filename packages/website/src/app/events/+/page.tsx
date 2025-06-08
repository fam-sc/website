import { Repository } from '@data/repo';
import { ClientComponent, ClientEvent } from './client';
import { richTextToHtml } from '@shared/richText/htmlBuilder';
import { redirect } from 'react-router';
import { Route } from './+types/page';

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

export async function loader() {
  const editEventId = '1';
  const event =
    typeof editEventId === 'string'
      ? await getClientEvent(editEventId)
      : undefined;

  if (event === undefined && typeof editEventId === 'string') {
    return redirect('/events/+');
  }

  return { event };
}

export default function Page({ loaderData: { event } }: Route.ComponentProps) {
  return <ClientComponent event={event} />;
}
