import { Sticker } from '@/botFlow/types';
import { Image, ImageProps } from '@/components/Image';
import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';

type StickerImageProps = ImageProps & {
  sticker: Sticker;
};

export function StickerImage({
  sticker,
  className,
  ...rest
}: StickerImageProps) {
  return (
    <Image
      className={classNames(className, styles.sticker)}
      src={sticker.source}
      width={sticker.width}
      height={sticker.height}
      {...rest}
    />
  );
}
