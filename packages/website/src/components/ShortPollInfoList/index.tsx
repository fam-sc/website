import { classNames } from '@/utils/classNames';
import { List } from '../List';
import { ShortPollInfo } from '../ShortPollInfo';
import styles from './index.module.scss';
import { Key } from 'react';

export type ShortPollInfoListProps = {
  className?: string;
  items: {
    id: Key;
    title: string;
    href: string;
  }[];
};

export function ShortPollInfoList({
  className,
  items,
}: ShortPollInfoListProps) {
  return (
    <List className={classNames(styles.root, className)}>
      {items.map(({ id, title, href }) => (
        <li key={id}>
          <ShortPollInfo title={title} href={href} />{' '}
        </li>
      ))}
    </List>
  );
}
