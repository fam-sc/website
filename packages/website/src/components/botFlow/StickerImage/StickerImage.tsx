import { Sticker } from '@/api/botFlow/types';
import { getMediaFileUrl } from '@/api/media';
import { Image, ImageProps } from '@/components/Image';
import { classNames } from '@/utils/classNames';

import styles from './StickerImage.module.scss';

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
      src={getMediaFileUrl(`bot-flow/tg-sticker/${sticker.mediaId}`)}
      {...rest}
    />
  );
}
