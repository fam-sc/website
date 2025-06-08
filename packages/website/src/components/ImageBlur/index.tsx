/* eslint-disable jsx-a11y/alt-text */
import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';
import { PropsMap } from '@/types/react';

type ImageProps = PropsMap['img'];

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
      <img className={styles.main} {...imageProps} />
      <img className={styles.background} {...imageProps} />
    </div>
  );
}
