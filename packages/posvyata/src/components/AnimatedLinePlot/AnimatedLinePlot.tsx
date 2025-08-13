import { classNames } from '@/utils/classNames';
import { Point } from '@/utils/svg';

import styles from './AnimatedLinePlot.module.scss';

export interface AnimatedLinePlotProps {
  className?: string;
  data: string;
}

export function AnimatedLinePlot({ className, data }: AnimatedLinePlotProps) {
  return (
    <svg className={classNames(className)} viewBox="0 0 500 150">
      <path d={data} />
    </svg>
  );
}
