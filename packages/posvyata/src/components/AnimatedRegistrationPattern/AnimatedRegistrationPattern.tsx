import { SvgProps } from '@/icons/types';
import { classNames } from '@/utils/classNames';

import styles from './AnimatedRegistrationPattern.module.scss';

const HEX_COUNT = 8;
const ROTATION_STEP = 360 / HEX_COUNT;

export function AnimatedRegistrationPattern({ className, ...rest }: SvgProps) {
  return (
    <svg className={className} viewBox="0 0 400 400" {...rest}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {Array.from({ length: HEX_COUNT }, (_, i) => (
        <g
          key={i}
          style={{ [`--i`]: i }}
          className={classNames(styles['hex-group'], styles[`hex-group-${i}`])}
        >
          <path
            className={styles.hex}
            d="M200,50 Q300,100 350,200 Q300,300 200,350 Q100,300 50,200 Q100,100 200,50"
            filter="url(#glow)"
            transform={`rotate(${i * ROTATION_STEP} 200 200)`}
          />
        </g>
      ))}

      {Array.from({ length: 8 }, (_, i) => (
        <circle
          key={i}
          className={styles.circle}
          cx={200}
          cy={200}
          r={50 + i * 20}
        />
      ))}
    </svg>
  );
}
