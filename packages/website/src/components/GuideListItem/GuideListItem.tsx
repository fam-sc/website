import { ImageSize } from '@sc-fam/shared/image';
import { RichTextString } from '@sc-fam/shared/richText';
import { Link } from 'react-router';

import { RichText } from '@/components/RichText';
import { Typography } from '@/components/Typography';
import { EventIcon } from '@/icons/EventIcon';

import { Image } from '../Image';
import styles from './GuideListItem.module.scss';

export type GuideListItemProps = {
  id: number;
  title: string;
  createdAt: string;
  description: RichTextString;
  images: (ImageSize & {
    src: string;
  })[];
};

export function GuideListItem({
  id,
  images,
  title,
  createdAt,
  description,
}: GuideListItemProps) {
  return (
    <Link className={styles.root} to={`/guides/${id}`}>
      <Image multiple={images} sizes={{ default: '20vw' }} />

      <Typography className={styles.title} variant="h5">
        {title}
      </Typography>

      <RichText className={styles.description} text={description} />

      <Typography hasIcon className={styles.date}>
        <EventIcon aria-hidden />
        {createdAt}
      </Typography>
    </Link>
  );
}
