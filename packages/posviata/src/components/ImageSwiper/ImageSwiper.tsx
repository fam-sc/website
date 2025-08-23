import 'swiper/css';
import 'swiper/scss/free-mode';
import 'swiper/scss/navigation';

import { ReactNode, useState } from 'react';
import { Swiper as BaseSwiper } from 'swiper';
import { FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ArrowLeftIcon } from '@/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@/icons/ArrowRightIcon';
import { classNames } from '@/utils/classNames';
import { ImageInfo, ImageSizes } from '@/utils/image/types';

import { Image } from '../Image';
import styles from './ImageSwiper.module.scss';

export interface ImageSwiperProps {
  className?: string;
  images: ImageInfo[][];
  slidesOnDesktop?: number;
}

interface NavButtonProps {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

function NavButton(props: NavButtonProps) {
  return <button className={styles['nav-button']} {...props} />;
}

export function ImageSwiper({
  className,
  images,
  slidesOnDesktop = 1,
}: ImageSwiperProps) {
  const [swiper, setSwiper] = useState<BaseSwiper | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const currentSlidesPerView = isDesktop ? slidesOnDesktop : 1;

  const imageSizes: ImageSizes =
    slidesOnDesktop === 1
      ? { default: '100vw' }
      : {
          default: '100vw',
          900: `${(100 / slidesOnDesktop).toFixed(2)}vw`,
        };

  return (
    <div className={classNames(styles.root, className)}>
      <NavButton
        disabled={selectedIndex === 0}
        onClick={() => {
          swiper?.slidePrev();
        }}
      >
        <ArrowLeftIcon />
      </NavButton>

      <Swiper
        className={styles.swiper}
        modules={[Navigation, FreeMode]}
        slidesPerView={1}
        onSwiper={setSwiper}
        onSlideChange={(swiper) => {
          setSelectedIndex(swiper.realIndex);
        }}
        freeMode={{
          sticky: false,
        }}
        breakpoints={{
          900: {
            slidesPerView: slidesOnDesktop,
          },
        }}
      >
        {images.map((image, i) => (
          <SwiperSlide key={i} className={styles.item}>
            <Image multiple={image} sizes={imageSizes} />
          </SwiperSlide>
        ))}
      </Swiper>

      <NavButton
        disabled={selectedIndex === images.length - currentSlidesPerView}
        onClick={() => {
          swiper?.slideNext();
        }}
      >
        <ArrowRightIcon />
      </NavButton>
    </div>
  );
}
