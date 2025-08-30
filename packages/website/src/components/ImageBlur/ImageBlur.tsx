import { classNames } from '@sc-fam/shared';

import { VarImage, VarImageProps } from '../VarImage';
import styles from './ImageBlur.module.scss';

export function ImageBlur({ image, className, ...rest }: VarImageProps) {
  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <VarImage className={styles.main} image={image} />
      <VarImage className={styles.background} image={image} />
    </div>
  );
}
