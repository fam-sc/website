import styles from './page.module.scss';
import { Pagination } from '@/components/Pagination';
import { getMediaFileUrl } from '@shared/media';
import { RichTextString } from '@shared/richText/types';
import { Event } from '@data/types';
import { EventListItem } from '@/components/EventListItem';
import { List } from '@/components/List';

export type ClientEvent = {
  id: string;
  status: Event['status'];
  title: string;
  date: string;
  description: RichTextString;
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
  return (
    <div className={styles.root}>
      <List>
        {items.map((item) => (
          <li key={item.id}>
            <EventListItem
              {...item}
              imageSrc={getMediaFileUrl(`events/${item.id}`)}
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
