import { classNames } from '@sc-fam/shared';

import { StickerId } from '@/api/botFlow/types';
import { getMediaFileUrl } from '@/api/media';
import { Image, ImageProps } from '@/components/Image';

import styles from './StickerImage.module.scss';

type StickerImageProps = ImageProps & {
  stickerKey: StickerId;
};

export function StickerImage({
  stickerKey,
  className,
  ...rest
}: StickerImageProps) {
  return (
    <Image
      className={classNames(className, styles.sticker)}
      src={getMediaFileUrl(stickerKey)}
      {...rest}
    />
  );
}
