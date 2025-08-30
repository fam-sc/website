import React, { Suspense } from 'react';

import { type ImageSwiperProps } from '../ImageSwiper/ImageSwiper';
import { LoadingIndicatorWrapper } from '../LoadingIndicatorWrapper';

const ImageSwiper = React.lazy(async () => {
  const { ImageSwiper } = await import('@/components/ImageSwiper');

  return { default: ImageSwiper };
});

export function LazyImageSwiper(props: ImageSwiperProps) {
  return (
    <Suspense fallback={<LoadingIndicatorWrapper />}>
      <ImageSwiper {...props} />
    </Suspense>
  );
}
