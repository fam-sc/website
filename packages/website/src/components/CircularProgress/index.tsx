import { useMemo } from 'react';

import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';

export type CircularProgressProps = {
  // A number between 0 and 1.
  value: number;

  className?: string;
};

const RADIUS = 90;
const CENTER = 100;

function calcOffset(value: number): number {
  if (Number.isNaN(value)) {
    value = 0;
  }

  return (1 - value) * Math.PI * RADIUS * 2;
}

export function CircularProgress({ value, className }: CircularProgressProps) {
  const dashOffset = useMemo(() => calcOffset(value), [value]);

  return (
    <svg
      className={classNames(styles.root, className)}
      viewBox="0 0 200 200"
      role="progress"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={value}
    >
      <circle
        className={styles['back-circle']}
        r={RADIUS}
        cx={CENTER}
        cy={CENTER}
      />

      <circle
        className={styles['arc']}
        r={RADIUS}
        cx={CENTER}
        cy={CENTER}
        strokeDasharray="565.48px"
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
      />
    </svg>
  );
}
