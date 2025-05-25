import { Repository } from '@data/repo';
import { ClientComponent } from './client';
import { formatDateTime } from '@/utils/date';
import { shortenRichText } from '@shared/richText/short';
import { WithId } from 'mongodb';
import { ClientEvent } from '../events/(list)/client';
import { Event } from '@data/types';
import { Metadata } from 'next';

function toClientEvent(event: WithId<Event>): ClientEvent {
  return {
    id: event._id.toString(),
    status: event.status,
    title: event.title,
    date: formatDateTime(event.date),
    description: shortenRichText(event.description, 200),
  };
}

export const metadata: Metadata = {
  title: 'Студентство',
};

export default async function Page() {
  await using repo = await Repository.openConnection();
  const latestEvents = await repo.events().getLatestEvents(3);

  return (
    <ClientComponent
      latestEvents={latestEvents.map((value) => toClientEvent(value))}
    />
  );
}
