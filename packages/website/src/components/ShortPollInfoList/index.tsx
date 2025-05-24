import { classNames } from '@/utils/classNames';
import { List } from '../List';
import { ShortPollInfo } from '../ShortPollInfo';
import styles from './index.module.scss';
import { Key } from 'react';

export type ShortPollInfoListProps = {
  className?: string;
  canVisitPoll: boolean;
  items: {
    id: Key;
    title: string;
    href: string;
  }[];
};

export function ShortPollInfoList({
  className,
  canVisitPoll,
  items,
}: ShortPollInfoListProps) {
  return (
    <List className={classNames(styles.root, className)}>
      {items.map(({ id, title, href }) => (
        <li key={id}>
          <ShortPollInfo title={title} href={canVisitPoll ? href : undefined} />
        </li>
      ))}
    </List>
  );
}
