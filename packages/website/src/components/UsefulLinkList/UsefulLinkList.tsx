import { classNames } from '@sc-fam/shared';

import { ImageInfo } from '@/utils/image/types';

import { Image } from '../Image';
import { Link } from '../Link';
import { Typography } from '../Typography';
import styles from './UsefulLinkList.module.scss';

export type UsefulLinkListItem = {
  id: string;
  title: string;
  href: string;
  images: ImageInfo[];
};

export type UsefulLinkListProps = {
  className?: string;
  items: UsefulLinkListItem[];
};

export function UsefulLinkList({ items, className }: UsefulLinkListProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item) => (
        <Link key={item.id} to={item.href} linkVariant="clean">
          <figure>
            <Typography as="figcaption" className={styles['item-title']}>
              {item.title}
            </Typography>

            <Image multiple={item.images} sizes={{ default: '30vw' }} />
          </figure>
        </Link>
      ))}
    </div>
  );
}
