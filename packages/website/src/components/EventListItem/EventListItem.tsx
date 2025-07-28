import { EventStatus } from '@sc-fam/data';
import { RichTextString } from '@sc-fam/shared/richText';
import { Link } from 'react-router';

import { EventStatusMarker } from '@/components/EventStatusMarker';
import { RichText } from '@/components/RichText';
import { Typography } from '@/components/Typography';
import { EventIcon } from '@/icons/EventIcon';
import { ImageInfo } from '@/utils/image/types';

import { Image } from '../Image';
import styles from './EventListItem.module.scss';

export type EventListItemProps = {
  slug: string;
  status: EventStatus;
  title: string;
  date: string;
  description: RichTextString;
  images: ImageInfo[];
};

export function EventListItem({
  slug,
  images,
  status,
  title,
  date,
  description,
}: EventListItemProps) {
  return (
    <Link className={styles.root} to={`/events/${slug}`}>
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
