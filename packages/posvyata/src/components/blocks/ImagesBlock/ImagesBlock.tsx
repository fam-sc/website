import range from 'lodash/range';
import React, { Suspense } from 'react';

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
      <h2 className={styles.title}>HELL YEAH</h2>

      <Suspense fallback={<LoadingIndicatorWrapper />}>
        <ImageSwiper
          className={styles.grid}
          images={range(9).map(() => Image1)}
        />
      </Suspense>
    </BlockContainer>
  );
}
