import { Event, EventStatus } from '@data/types';
import { UserRole } from '@data/types/user';
import { formatDateTime } from '@shared/chrono/date';
import { ImageSize } from '@shared/image/types';
import { coerce } from '@shared/math';
import { parseInt } from '@shared/parseInt';
import { shortenRichText } from '@shared/richText/short';
import { RichTextString } from '@shared/richText/types';
import { redirect } from 'react-router';

import { getMediaFileUrl } from '@/api/media';
import { useAuthInfo } from '@/auth/context';
import { EventListItem } from '@/components/EventListItem';
import { LinkButton } from '@/components/LinkButton';
import { List } from '@/components/List';
import { Pagination } from '@/components/Pagination';
import { PlusIcon } from '@/icons/PlusIcon';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';

type ClientEvent = {
  id: number;
  status: EventStatus;
  title: string;
  date: string;
  description: RichTextString;
  images: ImageSize[];
};

const ITEMS_PER_PAGE = 5;

function toClientEvent(event: Event): ClientEvent {
  return {
    id: event.id,
    status: event.status,
    title: event.title,
    date: formatDateTime(new Date(event.date)),
    description: shortenRichText(event.description, 200, 'ellipsis'),
    images: event.images,
  };
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const rawPage = searchParams.get('page');
  let page = parseInt(rawPage) ?? 1;

  const repo = repository(context);
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
  const { user } = useAuthInfo();
  const canAddEvent = user !== null && user.role >= UserRole.ADMIN;

  return (
    <div className={styles.root}>
      {canAddEvent && (
        <LinkButton hasIcon className={styles['add-event']} to="/events/+">
          <PlusIcon aria-hidden />
          Додати
        </LinkButton>
      )}

      <List className={styles.list}>
        {items.map(({ id, images, ...rest }) => (
          <li key={id}>
            <EventListItem
              {...rest}
              id={id}
              images={images.map(({ width, height }) => ({
                src: getMediaFileUrl(`events/${id}/${width}`),
                width,
                height,
              }))}
            />
          </li>
        ))}
      </List>

      {totalPages > 1 && (
        <Pagination
          className={styles.pagination}
          current={page}
          total={totalPages}
          getLink={(page) => (page === 1 ? '/events' : `/events?page=${page}`)}
        />
      )}
    </div>
  );
}
