import { classNames } from '@/utils/classNames';

import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
}

/*
const data = buildSvgPlot([
  [0, 0.6],
  [0.15, 0.2],
  [0.4, 0.3],
  [0.5, 0.3],
  [0.6, 0.3],
  [0.7, 0.3],
  [0.9, 0.6],
  [1, 0.2],
]);
*/

export function Header({ className }: HeaderProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <p className={styles.text}>TEXT</p>
    </div>
  );
}
