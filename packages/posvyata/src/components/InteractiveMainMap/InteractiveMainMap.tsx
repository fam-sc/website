import { useInView } from 'motion/react';
import { ComponentProps, useRef } from 'react';

import mainImage from '@/images/maps/main.png?multiple';
import { classNames } from '@/utils/classNames';

import { Image } from '../Image';
import { MapContext } from '../MapContext';
import { MapMarker } from '../MapMarker';
import styles from './InteractiveMainMap.module.scss';

export type InteractiveMainMapProps = ComponentProps<'div'>;

const SHELTER_NAME = 'Укриття';

export function InteractiveMainMap({
  className,
  ...rest
}: InteractiveMainMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={classNames(styles.root, className)} {...rest}>
      <MapContext.Provider value={{ inView }}>
        <div className={styles.content}>
          <Image
            className={styles.image}
            multiple={mainImage}
            draggable={false}
          />

          <MapMarker
            x={0.7}
            y={0.34}
            type="target"
            description="BBQ Зона Сад"
          />

          <MapMarker
            x={0.07}
            y={0.31}
            type="shelter"
            description={SHELTER_NAME}
          />

          <MapMarker
            x={0.43}
            y={0.47}
            type="shelter"
            description={SHELTER_NAME}
          />

          <MapMarker
            x={0.42}
            y={0.35}
            type="shelter"
            description={SHELTER_NAME}
            descriptionPosition="left"
          />
        </div>
      </MapContext.Provider>
    </div>
  );
}
