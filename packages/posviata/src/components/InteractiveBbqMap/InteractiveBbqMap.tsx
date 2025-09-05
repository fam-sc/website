import { classNames } from '@sc-fam/shared';
import { ComponentProps } from 'react';

import mapImage from '@/images/maps/bbq.png?multiple';

import { Image } from '../Image';
import { MovingPath } from '../MovingPath';
import styles from './InteractiveBbqMap.module.scss';

export type InteractiveBbqMapProps = ComponentProps<'div'>;

export function InteractiveBbqMap({
  className,
  ...rest
}: InteractiveBbqMapProps) {
  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <div className={styles.content}>
        <Image className={styles.image} multiple={mapImage} draggable={false} />

        <svg viewBox="0 0 1574 1665" className={styles.overlay}>
          <MovingPath
            className={classNames(styles.shape, styles['main-place'])}
            d="M252 728L259 623L246 525.5L181.5 476.5L76.5 461.5V369.5L166 329.5L252 183.5L551.5 194.5L749.5 270.5L794.5 399.5L749.5 516L642 537L621.75 632.5L556 728H252Z"
            fill={750}
            gap={120}
            strokeWidth="5"
          />

          <MovingPath
            className={classNames(styles.shape, styles['wc-place'])}
            d="M1442.5 1530 h79 v98h-79Z"
            fill={70}
            gap={20}
            strokeWidth="5"
          />
        </svg>
      </div>
    </div>
  );
}
