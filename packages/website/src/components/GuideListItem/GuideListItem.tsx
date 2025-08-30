import { classNames } from '@sc-fam/shared';
import { RichTextString } from '@sc-fam/shared/richText';
import { Link } from 'react-router';

import { RichText } from '@/components/RichText';
import { Typography } from '@/components/Typography';
import { EventIcon } from '@/icons/EventIcon';
import { ImageInfo } from '@/utils/image/types';

import { Image } from '../Image';
import styles from './GuideListItem.module.scss';

export type GuideListItemProps = {
  slug: string;
  title: string;
  createdAt: string;
  description: RichTextString;
  images: ImageInfo[] | null;
};

export function GuideListItem({
  slug,
  images,
  title,
  createdAt,
  description,
}: GuideListItemProps) {
  return (
    <Link
      className={classNames(
        styles.root,
        images === null && styles[`root-no-image`]
      )}
      to={`/guides/${slug}`}
    >
      {images && <Image multiple={images} sizes={{ default: '20vw' }} />}

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
