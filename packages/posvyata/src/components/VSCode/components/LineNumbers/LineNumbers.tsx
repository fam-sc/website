import range from 'lodash/range';

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
      {range(1, count + 1).map((number) => (
        <Typography key={number}>{number}</Typography>
      ))}
    </div>
  );
}
