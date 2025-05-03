import { classNames } from '@/utils/classNames';
import styles from './index.module.scss';
import { ReactNode } from 'react';
import Link from 'next/link';
import { Typography } from '../Typography';

export type PageNavProps = {
  className?: string;
  current: number;
  total: number;

  getLink: (page: number) => string;
};

export function PageNav({ className, current, total, getLink }: PageNavProps) {
  const items: ReactNode[] = [];

  for (let i = 1; i <= total; i++) {
    items.push(
      <li data-current={i === current}>
        {i === current ? (
          <Typography>{i}</Typography>
        ) : (
          <Link href={getLink(i)}>
            <span>{i}</span>
          </Link>
        )}
      </li>
    );
  }

  return <ul className={classNames(styles.root, className)}>{items}</ul>;
}
