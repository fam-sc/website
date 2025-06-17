import { coerce } from '@shared/math';
import { WithId } from 'mongodb';
import { Event } from '@data/types';
import { formatDateTime } from '@shared/date';
import { shortenRichText } from '@shared/richText/short';
import { parseInt } from '@shared/parseInt';
import { redirect } from 'react-router';
import { Route } from './+types/page';
import { Repository } from '@data/repo';
import styles from './page.module.scss';
import { Pagination } from '@/components/Pagination';
import { getMediaFileUrl } from '@/api/media';
import { EventListItem } from '@/components/EventListItem';
import { List } from '@/components/List';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';
import { LinkButton } from '@/components/LinkButton';
import { PlusIcon } from '@/icons/PlusIcon';
import { ImageSize } from '@shared/image/types';
import { RichTextString } from '@shared/richText/types';

type ClientEvent = {
  id: string;
  status: 'pending' | 'ended';
  title: string;
  date: string;
  description: RichTextString;
  images: ImageSize[];
};

const ITEMS_PER_PAGE = 5;

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

export async function loader({ request }: Route.LoaderArgs) {
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
