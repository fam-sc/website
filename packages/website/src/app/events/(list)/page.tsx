import { Repository } from '@data/repo';
import { PageProps } from '@/types/next';
import { coerce } from '@/utils/math';
import { ClientComponent, ClientEvent } from './client';
import { redirect, RedirectType } from 'next/navigation';
import { WithId } from 'mongodb';
import { Event } from '@data/types';
import { formatDateTime } from '@/utils/date';
import { shortenRichText } from '@shared/richText/short';
import { parseInt } from '@/utils/parseInt';

const ITEMS_PER_PAGE = 5;

function toClientEvent(event: WithId<Event>): ClientEvent {
  return {
    id: event._id.toString(),
    status: event.status,
    title: event.title,
    date: formatDateTime(event.date),
    description: shortenRichText(event.description, 200),
    image: event.image,
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { page: rawPage } = await searchParams;
  let page = parseInt(rawPage) ?? 1;

  await using repo = await Repository.openConnection();
  const { total: totalItems, items } = await repo
    .events()
    .getPage(page - 1, ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const oldPage = page;
  page = coerce(page, 1, totalPages);

  if (oldPage !== page) {
    redirect(`/events/?page=${page}`, RedirectType.replace);
  }

  return (
    <ClientComponent
      items={items.map((event) => toClientEvent(event))}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
