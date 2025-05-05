import { HTMLAttributes, Ref } from 'react';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

export interface IndeterminateCircularProgressProps
  extends HTMLAttributes<SVGElement> {
  ref?: Ref<SVGSVGElement>;
  className?: string;
}

const STROKE_WIDTH = 3;
const RADIUS = 20;
const SIZE = (RADIUS + STROKE_WIDTH) * 2;
const VIEWBOX = `0 0 ${SIZE} ${SIZE}`;

export function IndeterminateCircularProgress({
  className,
  ref,
  ...rest
}: IndeterminateCircularProgressProps) {
  return (
    <svg
      ref={ref}
      className={classNames(styles.root, className)}
      viewBox={VIEWBOX}
      {...rest}
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        strokeWidth={STROKE_WIDTH}
        strokeMiterlimit={5}
      />
    </svg>
  );
}
