import { ReactNode } from 'react';

import { classNames } from '@/utils/classNames';

import styles from './BlockContainer.module.scss';

export interface BlockContainerProps {
  className?: string;
  children: ReactNode;
}

export function BlockContainer({ className, children }: BlockContainerProps) {
  return <div className={classNames(styles.root, className)}>{children}</div>;
}
