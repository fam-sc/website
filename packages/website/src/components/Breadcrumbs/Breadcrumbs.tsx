import { joinArray } from '@sc-fam/shared/collections';

import { ArrowRightIcon } from '@/icons/ArrowRightIcon';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { Link } from '../Link';
import styles from './Breadcrumbs.module.scss';

export type BreadcrumbItem = {
  title: string;
  href: string;
};

type NavProps = PropsMap['nav'];

export interface BreadcrumbsProps extends NavProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items, className, ...rest }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={classNames(styles.root, className)}
      {...rest}
    >
      <ul>
        {joinArray(
          items.map(({ title, href }, i) => (
            <li key={href}>
              <Link
                linkVariant="clean"
                to={href}
                aria-current={i === items.length - 1 ? 'page' : undefined}
              >
                {title}
              </Link>
            </li>
          )),
          (i) => (
            <li key={i} aria-hidden="true">
              <ArrowRightIcon />
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
