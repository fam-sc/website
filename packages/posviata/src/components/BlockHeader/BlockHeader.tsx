import { classNames } from '@sc-fam/shared';
import { ReactNode } from 'react';

import styles from './BlockHeader.module.scss';

export interface BlockHeaderProps {
  className?: string;
  children: ReactNode;
}

export function BlockHeader({ className, children }: BlockHeaderProps) {
  return <h2 className={classNames(styles.root, className)}>{children}</h2>;
}
