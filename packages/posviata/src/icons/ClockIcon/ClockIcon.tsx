import { useInView } from 'motion/react';
import { useRef } from 'react';

import { classNames } from '@/utils/classNames';

import { SvgProps } from '../types';
import styles from './ClockIcon.module.scss';

export function ClockIcon(rest: SvgProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true });

  return (
    <svg ref={ref} viewBox="0 0 24 24" width="24px" height="24px" {...rest}>
      <circle cx={12} cy={12} r={10} strokeWidth={2} fill="transparent" />

      <path
        d="M12 12 L12 6Z"
        strokeWidth={2}
        className={classNames(
          styles['primary-line'],
          inView && styles['primary-line-anim']
        )}
      />
      <path
        d="M12 12 L12 6Z"
        strokeWidth={2}
        className={classNames(
          styles['secondary-line'],
          inView && styles['secondary-line-anim']
        )}
      />
    </svg>
  );
}
