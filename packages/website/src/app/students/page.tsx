import { ClientComponent } from './client';
import { formatDateTime } from '@shared/date';
import { shortenRichText } from '@shared/richText/short';
import { WithId } from 'mongodb';
import { ClientEvent } from '../events/(list)/client';
import { Event } from '@data/types';
import { Route } from './+types/page';
import { Repository } from '@data/repo';

function toClientEvent(event: WithId<Event>): ClientEvent {
  return {
    id: event._id.toString(),
    status: event.status,
    title: event.title,
    date: formatDateTime(event.date),
    description: shortenRichText(event.description, 200, 'ellipsis'),
    images: event.images,
  };
}

export async function loader() {
  await using repo = await Repository.openConnection();
  const latestEvents = await repo.events().getLatestEvents(3);

  return { latestEvents: latestEvents.map((value) => toClientEvent(value)) };
}

export default function Page({
  loaderData: { latestEvents },
}: Route.ComponentProps) {
  return <ClientComponent latestEvents={latestEvents} />;
}
