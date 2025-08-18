import range from 'lodash/range';
import React, { Suspense } from 'react';

import { BlockHeader } from '@/components/BlockHeader';
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
      <BlockHeader className={styles.title}>HELL YEAH</BlockHeader>

      <Suspense fallback={<LoadingIndicatorWrapper />}>
        <ImageSwiper
          className={styles.grid}
          images={range(9).map(() => Image1)}
        />
      </Suspense>
    </BlockContainer>
  );
}
