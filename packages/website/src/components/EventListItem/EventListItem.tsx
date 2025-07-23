import { EventStatus } from '@data/types';
import { ImageSize } from '@shared/image/types';
import { RichTextString } from '@shared/richText/types';
import { Link } from 'react-router';

import { EventStatusMarker } from '@/components/EventStatusMarker';
import { RichText } from '@/components/RichText';
import { Typography } from '@/components/Typography';
import { EventIcon } from '@/icons/EventIcon';

import { Image } from '../Image';
import styles from './EventListItem.module.scss';

export type EventListItemProps = {
  id: number;
  status: EventStatus;
  title: string;
  date: string;
  description: RichTextString;
  images: (ImageSize & {
    src: string;
  })[];
};

export function EventListItem({
  id,
  images,
  status,
  title,
  date,
  description,
}: EventListItemProps) {
  return (
    <Link className={styles.root} to={`/events/${id}`}>
      <Image multiple={images} sizes={{ default: '20vw' }} />

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
