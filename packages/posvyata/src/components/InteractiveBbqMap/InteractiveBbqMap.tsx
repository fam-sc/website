import { ComponentProps } from 'react';

import mapImage from '@/images/maps/bbq.png?multiple';
import { classNames } from '@/utils/classNames';

import { Image } from '../Image';
import { MovingRect } from '../MovingRect';
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

        <div className={styles.overlay}>
          <MovingRect
            className={classNames(styles.shape, styles['main-place'])}
          />

          <MovingRect
            className={classNames(styles.shape, styles['wc-place'])}
          />
        </div>
      </div>
    </div>
  );
}
