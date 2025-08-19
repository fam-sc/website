import { SvgProps } from '@/icons/types';
import { classNames } from '@/utils/classNames';

import styles from './MovingPath.module.scss';

export interface MovingPathProps extends Omit<SvgProps, 'fill'> {
  d: string;
  fill: number;
  gap: number;
}

export function MovingPath({
  className,
  d,
  fill,
  gap,
  ...rest
}: MovingPathProps) {
  return (
    <svg
      className={classNames(styles.root, className)}
      style={{ ['--fill']: fill, ['--gap']: gap }}
      {...rest}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path className={styles.main} d={d} filter="url(#glow)" />
    </svg>
  );
}
