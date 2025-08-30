import { classNames } from '@sc-fam/shared';
import { ReactNode } from 'react';

import styles from './BlockContainer.module.scss';

export interface BlockContainerProps {
  className?: string;
  id?: string;
  children: ReactNode;
}

export function BlockContainer({
  className,
  id,
  children,
}: BlockContainerProps) {
  return (
    <div id={id} className={classNames(styles.root, className)}>
      {children}
    </div>
  );
}
