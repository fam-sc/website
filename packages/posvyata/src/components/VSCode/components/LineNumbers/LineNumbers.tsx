import { Typography } from '@/components/Typography';
import { classNames } from '@/utils/classNames';

import styles from './LineNumbers.module.scss';

export interface LineNumbersProps {
  className?: string;
  count: number;
}

export function LineNumbers({ className, count }: LineNumbersProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {Array.from({ length: count }).map((_, number) => (
        <Typography key={number}>{number + 1}</Typography>
      ))}
    </div>
  );
}
