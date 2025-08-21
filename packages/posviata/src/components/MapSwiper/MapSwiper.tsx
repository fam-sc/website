import { classNames } from '@/utils/classNames';

import { InteractiveBbqMap } from '../InteractiveBbqMap';
import { InteractiveMainMap } from '../InteractiveMainMap';
import styles from './MapSwiper.module.scss';

export type MapType = 'main' | 'bbq';

export interface MapSwiperProps {
  selectedType: MapType;
  className?: string;
}

export function MapSwiper({ className, selectedType }: MapSwiperProps) {
  return (
    <div
      className={classNames(styles.root, className)}
      style={{ ['--slide']: selectedType == 'main' ? 0 : 1 }}
    >
      <div className={styles.strip}>
        <div className={styles.slide}>
          <InteractiveMainMap />
        </div>

        <div className={styles.slide}>
          <InteractiveBbqMap />
        </div>
      </div>
    </div>
  );
}
