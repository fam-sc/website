import { Repository } from '@data/repo';
import { ClientComponent, ClientEvent } from './client';
import { richTextToHtml } from '@shared/richText/htmlBuilder';
import { redirect } from 'react-router';
import { Route } from './+types/page';

async function getClientEvent(
  repo: Repository,
  id: string
): Promise<ClientEvent | undefined> {
  try {
    const editEvent = await repo.events().findById(id);

    return editEvent
      ? {
          id,
          title: editEvent.title,
          date: editEvent.date,
          images: editEvent.images,
          description: richTextToHtml(editEvent.description, {
            mediaUrl: import.meta.env.VITE_MEDIA_URL,
          }),
        }
      : undefined;
  } catch {
    return undefined;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const editEventId = searchParams.get('edit');

  await using repo = await Repository.openConnection();
  const event =
    editEventId !== null ? await getClientEvent(repo, editEventId) : undefined;

  if (event === undefined && editEventId !== null) {
    return redirect('/events/+');
  }

  return { event };
}

export default function Page({ loaderData: { event } }: Route.ComponentProps) {
  return <ClientComponent event={event} />;
}
