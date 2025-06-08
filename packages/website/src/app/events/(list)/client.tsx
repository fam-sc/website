import styles from './page.module.scss';
import { Pagination } from '@/components/Pagination';
import { getMediaFileUrl } from '@shared/api/media';
import { RichTextString } from '@shared/richText/types';
import { EventListItem } from '@/components/EventListItem';
import { List } from '@/components/List';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@shared/api/user/types';
import { LinkButton } from '@/components/LinkButton';
import { PlusIcon } from '@/icons/PlusIcon';
import { ImageSize } from '@shared/image/types';

export type ClientEvent = {
  id: string;
  status: 'pending' | 'ended';
  title: string;
  date: string;
  description: RichTextString;
  image?: ImageSize;
};

export type ClientComponentProps = {
  items: ClientEvent[];
  currentPage: number;
  totalPages: number;
};

export function ClientComponent({
  items,
  currentPage,
  totalPages,
}: ClientComponentProps) {
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
        {items.map(({ id, image, ...rest }) => (
          <li key={id}>
            <EventListItem
              {...rest}
              id={id}
              image={{
                src: getMediaFileUrl(`events/${id}`),
                width: image?.width ?? 0,
                height: image?.height ?? 0,
              }}
            />
          </li>
        ))}
      </List>

      {totalPages > 1 && (
        <Pagination
          className={styles.pagination}
          current={currentPage}
          total={totalPages}
          getLink={(page) => (page === 1 ? '/events' : `/events?page=${page}`)}
        />
      )}
    </div>
  );
}
