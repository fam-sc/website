import 'swiper/css';
import 'swiper/scss/free-mode';

import { useState } from 'react';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useScrollbar } from '@/hooks/useScrollbar';
import { classNames } from '@/utils/classNames';
import { ImageInfo } from '@/utils/image/types';

import { Image } from '../Image';
import styles from './ImageSwiper.module.scss';

export interface ImageSwiperProps {
  className?: string;
  images: ImageInfo[][];
}

export function ImageSwiper({ className, images }: ImageSwiperProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useScrollbar(selectedIndex < 0);

  return (
    <div className={classNames(styles.root, className)}>
      <Swiper
        modules={[FreeMode]}
        slidesPerView={1}
        freeMode={{
          sticky: false,
        }}
        breakpoints={{ 600: { slidesPerView: 3 } }}
      >
        {images.map((image, i) => (
          <SwiperSlide
            key={i}
            className={styles.item}
            onClick={() => setSelectedIndex(i)}
          >
            <Image multiple={image} />
          </SwiperSlide>
        ))}
      </Swiper>

      {selectedIndex >= 0 && (
        <div
          className={styles.dialog}
          onClick={() => {
            setSelectedIndex(-1);
          }}
        >
          <Image multiple={images[selectedIndex]} />
        </div>
      )}
    </div>
  );
}
