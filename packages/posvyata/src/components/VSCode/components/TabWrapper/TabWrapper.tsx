import { ReactNode } from 'react';

import styles from './TabWrapper.module.scss';

export interface TabWrapperProps {
  children: ReactNode;
}

export function TabWrapper({ children }: TabWrapperProps) {
  return <div className={styles.root}>{children}</div>;
}
