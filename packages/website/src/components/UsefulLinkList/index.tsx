import Image from 'next/image';

import { Link } from '../Link';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

type Item = {
  id: string;
  title: string;
  href: string;
  imageSrc: string;
};

export type UsefulLinkListProps = {
  className?: string;
  items: Item[];
};

export function UsefulLinkList({ items, className }: UsefulLinkListProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item) => (
        <Link key={item.id} href={item.href} linkVariant="clean">
          <Typography>{item.title}</Typography>

          <Image src={item.imageSrc} alt="" width={0} height={0} />
        </Link>
      ))}
    </div>
  );
}
