import { classNames } from '@sc-fam/shared';

import { Typography } from '@/components/Typography';

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
