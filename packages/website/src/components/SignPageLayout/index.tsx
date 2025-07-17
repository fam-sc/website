import { ReactNode } from 'react';

import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';

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
