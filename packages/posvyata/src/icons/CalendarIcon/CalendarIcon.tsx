import range from 'lodash/range';
import { useInView } from 'motion/react';
import { useRef } from 'react';

import { classNames } from '@/utils/classNames';

import { SvgProps } from '../types';
import styles from './CalendarIcon.module.scss';

export function CalendarIcon(rest: SvgProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true });

  return (
    <svg
      viewBox="0 -960 960 960"
      width="24px"
      height="24px"
      ref={ref}
      {...rest}
    >
      <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />

      {range(0, 6).map((i) => {
        const y = Math.floor(i / 3);
        const x = i - y * 3;

        return (
          <circle
            key={i}
            cx={290 + x * 180}
            cy={-450 + y * 200}
            style={{ [`--delay`]: `${(i * 0.05).toFixed(2)}s` }}
            className={classNames(
              styles.circle,
              inView && styles[`circle-anim`]
            )}
          />
        );
      })}
    </svg>
  );
}
