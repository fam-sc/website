/* eslint-disable jsx-a11y/alt-text */
import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';
import Image, { ImageProps } from 'next/image';

export function ImageBlur({
  src,
  alt,
  width,
  height,
  className,
  ...rest
}: ImageProps) {
  const imageProps = { src, alt, width, height };

  return (
    <div className={classNames(styles.root, className)} {...rest}>
      <Image className={styles.main} {...imageProps} />
      <Image className={styles.background} {...imageProps} />
    </div>
  );
}
