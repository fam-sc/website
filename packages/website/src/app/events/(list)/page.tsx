import { Repository } from '@data/repo';
import { coerce } from '@shared/math';
import { ClientComponent, ClientEvent } from './client';
import { WithId } from 'mongodb';
import { Event } from '@data/types';
import { formatDateTime } from '@shared/date';
import { shortenRichText } from '@shared/richText/short';
import { parseInt } from '@shared/parseInt';
import { redirect } from 'react-router';
import { Route } from './+types/page';

const ITEMS_PER_PAGE = 5;

function toClientEvent(event: WithId<Event>): ClientEvent {
  return {
    id: event._id.toString(),
    status: event.status,
    title: event.title,
    date: formatDateTime(event.date),
    description: shortenRichText(event.description, 200, 'ellipsis'),
    image: event.image,
  };
}

/*
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { page: rawPage } = await searchParams;
  const page = parseInt(rawPage) ?? 1;
  const description = `Сторінка ${page}`;

  return {
    title: 'Події',
    description,
    openGraph: {
      description,
    },
  };
}
*/

export async function loader({ request }: Route.LoaderArgs) {
  //const { page: rawPage } = await searchParams;
  const { searchParams } = new URL(request.url);
  const rawPage = searchParams.get('page');
  let page = parseInt(rawPage) ?? 1;

  await using repo = await Repository.openConnection();
  const { total: totalItems, items } = await repo
    .events()
    .getPage(page - 1, ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const oldPage = page;
  page = coerce(page, 1, totalPages);

  if (oldPage !== page) {
    return redirect(`/events/?page=${page}`);
  }

  return {
    items: items.map((event) => toClientEvent(event)),
    page,
    totalPages,
  };
}

export default function Page({
  loaderData: { items, page, totalPages },
}: Route.ComponentProps) {
  return (
    <ClientComponent items={items} currentPage={page} totalPages={totalPages} />
  );
}
