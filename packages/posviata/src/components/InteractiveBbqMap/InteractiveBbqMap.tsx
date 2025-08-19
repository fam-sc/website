import { ComponentProps } from 'react';

import mapImage from '@/images/maps/bbq.png?multiple';
import { classNames } from '@/utils/classNames';

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

        <svg viewBox="0 0 100 105.781" className={styles.overlay}>
          <MovingPath
            className={classNames(styles.shape, styles['main-place'])}
            d="m1.2488 1.9203 29.946-0.018608 0.03543 9.5557s-0.67391 0.74582-2.3276 1.8443c-5.3846 3.5769-3.8359 7.7695-6.1726 8.7154-1.1079 0.44851-9.9086 0.28637-13.114 0.3331-2.867 0.0637-5.5984-0.21488-8.4517-0.45265z"
            fill={100}
            gap={15}
            strokeWidth=".5"
          />

          <MovingPath
            className={classNames(styles.shape, styles['wc-place'])}
            d="m91.968 97.945 4.9019-0.01181-0.14318 6.0807h-4.8428z"
            fill={25}
            gap={6}
            strokeWidth=".3"
          />
        </svg>
      </div>
    </div>
  );
}
