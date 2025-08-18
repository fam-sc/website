import 'swiper/css';

import { useEffect, useState } from 'react';
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

export function MapSwiper({
  className,
  selectedType,
  onSelectedType,
}: MapSwiperProps) {
  const [swiper, setSwiper] = useState<BaseSwiper | null>(null);

  useEffect(() => {
    swiper?.slideTo(selectedType == 'main' ? 0 : 1);
  }, [swiper, selectedType]);

  return (
    <Swiper
      modules={[Controller]}
      onSwiper={setSwiper}
      controller={{ control: swiper }}
      slidesPerView={1}
      autoHeight={false}
      allowTouchMove={false}
      className={classNames(styles.root, className)}
      onSlideChange={(swiper) => {
        const type: MapType = swiper.activeIndex === 0 ? 'main' : 'bbq';

        onSelectedType(type);
      }}
    >
      <SwiperSlide className={styles.slide}>
        <InteractiveMainMap />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <InteractiveBbqMap />
      </SwiperSlide>
    </Swiper>
  );
}
