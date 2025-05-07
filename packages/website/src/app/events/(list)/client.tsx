import styles from './page.module.scss';
import { Pagination } from '@/components/Pagination';
import Link from 'next/link';
import Image from 'next/image';
import { getMediaFileUrl } from '@shared/media';
import { Typography } from '@/components/Typography';
import { RichTextString } from '@shared/richText/types';
import { EventIcon } from '@/icons/EventIcon';
import { RichText } from '@/components/RichText';

export type ClientEvent = {
  id: string;
  title: string;
  date: string;
  description: RichTextString;
};

export type ClientComponentProps = {
  items: ClientEvent[];
  currentPage: number;
  totalPages: number;
};

function Item({ value }: { value: ClientEvent }) {
  return (
    <Link href={`/events/${value.id}`}>
      <Image
        src={getMediaFileUrl(`events/${value.id}`)}
        alt=""
        width={0}
        height={0}
      />

      <div className={styles['item-info']}>
        <Typography className={styles['item-title']} variant="h5">
          {value.title}
        </Typography>
        <RichText
          className={styles['item-description']}
          text={value.description}
        />
        <Typography className={styles['item-date']}>
          <EventIcon />
          {value.date}
        </Typography>
      </div>
    </Link>
  );
}

export function ClientComponent({
  items,
  currentPage,
  totalPages,
}: ClientComponentProps) {
  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <Item value={item} />
          </li>
        ))}
      </ul>

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
