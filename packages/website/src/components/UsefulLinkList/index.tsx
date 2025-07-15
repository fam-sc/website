import { classNames } from '@/utils/classNames';

import { Link } from '../Link';
import { Typography } from '../Typography';
import styles from './index.module.scss';

export type UsefulLinkListItem = {
  id: string;
  title: string;
  href: string;
  imageSrc: string;
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
          <Typography>{item.title}</Typography>

          <img src={item.imageSrc} alt="" width={0} height={0} />
        </Link>
      ))}
    </div>
  );
}
