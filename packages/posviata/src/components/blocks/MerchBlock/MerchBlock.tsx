import { BlockHeader } from '@/components/BlockHeader';
import { LazyImageSwiper } from '@/components/LazyImageSwiper';
import { LinkButton } from '@/components/LinkButton';

import { BlockContainer } from '../BlockContainer';
import { Info } from './components/Info';
import { images } from './images';
import styles from './MerchBlock.module.scss';

export function MerchBlock() {
  return (
    <BlockContainer className={styles.root}>
      <BlockHeader className={styles.header}>МЕРЧ</BlockHeader>

      <LazyImageSwiper
        className={styles.swiper}
        images={images}
        slidesOnDesktop={3}
      />

      <Info className={styles.info} />

      <LinkButton
        href="https://forms.gle/WPXYnWLoAa1wPKWq5"
        className={styles.order}
      >
        Замовляй зараз
      </LinkButton>
    </BlockContainer>
  );
}
