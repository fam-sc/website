import range from 'lodash/range';
import React, { Suspense } from 'react';

import { HoloText } from '@/components/HoloText';
import { LoadingIndicatorWrapper } from '@/components/LoadingIndicatorWrapper';
import Image1 from '@/images/imageBlock/1.jpg?multiple';

import { BlockContainer } from '../BlockContainer';
import styles from './ImagesBlock.module.scss';

const ImageSwiper = React.lazy(async () => {
  const { ImageSwiper } = await import('@/components/ImageSwiper');

  return { default: ImageSwiper };
});

export function ImagesBlock() {
  return (
    <BlockContainer className={styles.root}>
      <HoloText className={styles.title} text="HELL  YEAH" />

      <Suspense fallback={<LoadingIndicatorWrapper />}>
        <ImageSwiper
          className={styles.grid}
          images={range(9).map(() => Image1)}
        />
      </Suspense>
    </BlockContainer>
  );
}
