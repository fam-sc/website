import { Event } from '@/data/types';
import styles from './page.module.scss';
import { Typography } from '@/components/Typography';
import { getMediaFileUrl } from '@/api/media';
import Image from 'next/image';
import { RichText } from '@/components/RichText';

export type ClientComponentProps = {
  event: Event & { id: string };
};

export function ClientComponent({ event }: ClientComponentProps) {
  return (
    <div className={styles.root}>
      <Typography variant="h4">{event.title}</Typography>
      <Image
        className={styles.image}
        src={getMediaFileUrl(`events/${event.id}`)}
        alt=""
        width={0}
        height={0}
      />

      <RichText text={event.description} />
    </div>
  );
}
