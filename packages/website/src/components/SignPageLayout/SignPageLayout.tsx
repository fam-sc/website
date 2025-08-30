import { classNames } from '@sc-fam/shared';
import { ReactNode } from 'react';

import styles from './SignPageLayout.module.scss';

export interface SignPageLayoutProps {
  mainPosition: 'left' | 'right';
  main: ReactNode;
  other: ReactNode;
}

export function SignPageLayout({
  mainPosition,
  main,
  other,
}: SignPageLayoutProps) {
  return (
    <div className={classNames(styles.root, styles[`root-${mainPosition}`])}>
      <div className={styles.main}>{main}</div>
      <div className={styles.other}>{other}</div>
    </div>
  );
}
