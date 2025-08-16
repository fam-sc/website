import 'swiper/css';

import { ReactNode, useEffect, useState } from 'react';
import BaseSwiper from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { classNames } from '@/utils/classNames';

import { InteractiveBbqMap } from '../InteractiveBbqMap';
import { InteractiveMainMap } from '../InteractiveMainMap';
import styles from './MapSwiper.module.scss';

export type MapType = 'main' | 'bbq';

export interface MapSwiperProps {
  selectedType: MapType;
  onSelectedType: (value: MapType) => void;

  className?: string;
}

interface MapContainerProps {
  children: ReactNode;
}

function MapContainer({ children }: MapContainerProps) {
  return <div className={styles['map-container']}>{children}</div>;
}

export function MapSwiper({
  className,
  selectedType,
  onSelectedType,
}: MapSwiperProps) {
  const [swiper, setSwiper] = useState<BaseSwiper | null>(null);

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(selectedType == 'main' ? 0 : 1);
    }
  }, [swiper, selectedType]);

  return (
    <Swiper
      modules={[Controller]}
      onSwiper={setSwiper}
      controller={{ control: swiper }}
      slidesPerView={1}
      className={classNames(styles.root, className)}
      onSlideChange={(swiper) => {
        const type: MapType = swiper.activeIndex === 0 ? 'main' : 'bbq';

        onSelectedType(type);
      }}
    >
      <SwiperSlide>
        <MapContainer>
          <InteractiveMainMap />
        </MapContainer>
      </SwiperSlide>

      <SwiperSlide>
        <MapContainer>
          <InteractiveBbqMap />
        </MapContainer>
      </SwiperSlide>
    </Swiper>
  );
}
