import { SvgProps } from '@/icons/types';
import { classNames } from '@/utils/classNames';

import styles from './MovingPath.module.scss';

export interface MovingPathProps extends SvgProps {
  data: string;
}

export function MovingPath({ className, data, ...rest }: MovingPathProps) {
  return (
    <svg className={classNames(styles.root, className)} {...rest}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path className={styles.main} d={data} filter="url(#glow)" />
    </svg>
  );
}
