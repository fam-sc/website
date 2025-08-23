import { BlockHeader } from '@/components/BlockHeader';
import { LazyImageSwiper } from '@/components/LazyImageSwiper';

import { BlockContainer } from '../BlockContainer';
import { images } from './images';
import styles from './ImagesBlock.module.scss';

export function ImagesBlock() {
  return (
    <BlockContainer id="Фото" className={styles.root}>
      <BlockHeader className={styles.title}>HELL YEAH</BlockHeader>

      <LazyImageSwiper className={styles.swiper} images={images} />
    </BlockContainer>
  );
}
