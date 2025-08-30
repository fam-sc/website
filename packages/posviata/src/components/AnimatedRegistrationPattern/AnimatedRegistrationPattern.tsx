import { classNames } from '@sc-fam/shared';
import { useInView } from 'motion/react';
import { useRef } from 'react';

import { SvgProps } from '@/icons/types';

import styles from './AnimatedRegistrationPattern.module.scss';

const HEX_COUNT = 8;

export function AnimatedRegistrationPattern({ className, ...rest }: SvgProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref);

  return (
    <svg
      className={classNames(styles.root, className)}
      viewBox="0 0 400 400"
      ref={ref}
      {...rest}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        className={classNames(
          styles['hex-group'],
          inView && styles['hex-group-spin']
        )}
      >
        {Array.from({ length: HEX_COUNT }, (_, i) => (
          <g key={i} style={{ [`--i`]: i }}>
            <path
              className={styles.hex}
              d="M200,50 Q300,100 350,200 Q300,300 200,350 Q100,300 50,200 Q100,100 200,50"
              transform={`rotate(${i * 50} 200 200)`}
              filter="url(#glow)"
            />
          </g>
        ))}
      </g>

      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={200} cy={200} r={50 + i * 20} />
      ))}
    </svg>
  );
}
