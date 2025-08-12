import range from 'lodash/range';

import { HoloText } from '@/components/HoloText';
import { ImageGrid } from '@/components/ImageGrid';
import Image1 from '@/images/imageBlock/1.jpg?multiple';

import { BlockContainer } from '../BlockContainer';
import styles from './ImagesBlock.module.scss';

export function ImagesBlock() {
  return (
    <BlockContainer className={styles.root}>
      <HoloText text="HELL  YEAH" />

      <ImageGrid className={styles.grid} images={range(9).map(() => Image1)} />
    </BlockContainer>
  );
}
