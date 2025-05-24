import styles from './index.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/components/Typography';
import { EventIcon } from '@/icons/EventIcon';
import { RichText } from '@/components/RichText';
import { EventStatusMarker } from '@/components/EventStatusMarker';
import { Event, ImageInfo } from '@data/types';
import { RichTextString } from '@shared/richText/types';

export type EventListItemProps = {
  id: string;
  status: Event['status'];
  title: string;
  date: string;
  description: RichTextString;
  image: ImageInfo & {
    src: string;
  };
};

export function EventListItem({
  id,
  image,
  status,
  title,
  date,
  description,
}: EventListItemProps) {
  return (
    <Link className={styles.root} href={`/events/${id}`}>
      <Image src={image.src} alt="" width={image.width} height={image.height} />

      <Typography className={styles.title} variant="h5">
        {title}
      </Typography>

      <RichText className={styles.description} text={description} />

      <Typography hasIcon className={styles.date}>
        <EventIcon aria-hidden />
        {date}
      </Typography>

      <EventStatusMarker className={styles.status} status={status} />
    </Link>
  );
}
