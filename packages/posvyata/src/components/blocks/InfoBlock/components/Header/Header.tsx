import { classNames } from '@/utils/classNames';

import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <p className={styles.text}>ІНФО</p>
    </div>
  );
}
