import styles from './index.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/components/Typography';
import { EventIcon } from '@/icons/EventIcon';
import { RichText } from '@/components/RichText';
import { EventStatusMarker } from '@/components/EventStatusMarker';
import { Event } from '@data/types';
import { RichTextString } from '@shared/richText/types';

export type EventListItemProps = {
  id: string;
  imageSrc: string;
  status: Event['status'];
  title: string;
  date: string;
  description: RichTextString;
};

export function EventListItem({
  id,
  imageSrc,
  status,
  title,
  date,
  description,
}: EventListItemProps) {
  return (
    <Link className={styles.root} href={`/events/${id}`}>
      <Image src={imageSrc} alt="" width={0} height={0} />

      <Typography className={styles.title} variant="h5">
        {title}
      </Typography>

      <RichText className={styles.description} text={description} />

      <Typography hasIcon className={styles.date}>
        <EventIcon />
        {date}
      </Typography>

      <EventStatusMarker className={styles.status} status={status} />
    </Link>
  );
}
