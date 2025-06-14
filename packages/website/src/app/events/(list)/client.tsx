import styles from './page.module.scss';
import { Pagination } from '@/components/Pagination';
import { getMediaFileUrl } from '@/api/media';
import { RichTextString } from '@shared/richText/types';
import { EventListItem } from '@/components/EventListItem';
import { List } from '@/components/List';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@shared/api/user/types';
import { LinkButton } from '@/components/LinkButton';
import { PlusIcon } from '@/icons/PlusIcon';
import { ImageSize } from '@shared/image/types';
import { useCallback } from 'react';

export type ClientEvent = {
  id: string;
  status: 'pending' | 'ended';
  title: string;
  date: string;
  description: RichTextString;
  images: ImageSize[];
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
  const getLink = useCallback(
    (page: number) => (page === 1 ? '/events' : `/events?page=${page}`),
    []
  );

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
          current={currentPage}
          total={totalPages}
          getLink={getLink}
        />
      )}
    </div>
  );
}
