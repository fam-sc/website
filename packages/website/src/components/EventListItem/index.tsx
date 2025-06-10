import styles from './index.module.scss';
import { Typography } from '@/components/Typography';
import { EventIcon } from '@/icons/EventIcon';
import { RichText } from '@/components/RichText';
import { EventStatusMarker } from '@/components/EventStatusMarker';
import { RichTextString } from '@shared/richText/types';
import { EventStatus } from '@shared/api/events/types';
import { ImageSize } from '@shared/image/types';
import { Link } from 'react-router';

export type EventListItemProps = {
  id: string;
  status: EventStatus;
  title: string;
  date: string;
  description: RichTextString;
  image: ImageSize & {
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
    <Link className={styles.root} to={`/events/${id}`}>
      <img src={image.src} alt="" width={image.width} height={image.height} />

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
