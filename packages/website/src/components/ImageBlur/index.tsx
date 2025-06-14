import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';
import { VarImage, VarImageProps } from '../VarImage';

export function ImageBlur({ image, className, ...rest }: VarImageProps) {
  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <VarImage className={styles.main} image={image} />
      <VarImage className={styles.background} image={image} />
    </div>
  );
}
