import { BlockContainer } from '@/components/blocks/BlockContainer';
import { GravityDots } from '@/components/GravityDots';
import { Image } from '@/components/Image';
import { Typography } from '@/components/Typography';
import mathImage from '@/images/math_image.jpg?multiple';

import styles from './MathBlock.module.scss';

export function MathBlock() {
  return (
    <BlockContainer className={styles.root}>
      <GravityDots className={styles.dots} />

      <div className={styles['image-container']}>
        <Image multiple={mathImage} />
      </div>

      <div className={styles.glass}>
        <Typography font="murs-gothic" variant="h3">
          Title
        </Typography>

        <Typography variant="bodyLarge">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </div>
    </BlockContainer>
  );
}
