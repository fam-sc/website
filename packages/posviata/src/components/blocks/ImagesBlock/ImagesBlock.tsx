import React, { Suspense } from 'react';

import { BlockHeader } from '@/components/BlockHeader';
import { LoadingIndicatorWrapper } from '@/components/LoadingIndicatorWrapper';

import { BlockContainer } from '../BlockContainer';
import { images } from './images';
import styles from './ImagesBlock.module.scss';

const ImageSwiper = React.lazy(async () => {
  const { ImageSwiper } = await import('@/components/ImageSwiper');

  return { default: ImageSwiper };
});

export function ImagesBlock() {
  return (
    <BlockContainer id="Фото" className={styles.root}>
      <BlockHeader className={styles.title}>HELL YEAH</BlockHeader>

      <Suspense fallback={<LoadingIndicatorWrapper />}>
        <ImageSwiper className={styles.swiper} images={images} />
      </Suspense>
    </BlockContainer>
  );
}
